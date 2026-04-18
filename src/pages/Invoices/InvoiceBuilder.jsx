import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { useClientStore } from '../../store/useClientStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Plus, Trash2, Save, Download, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import InvoiceTemplate from '../../components/invoice/InvoiceTemplate';
import { generateInvoicePdf } from '../../utils/generatePdf';

export default function InvoiceBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, addInvoice, updateInvoice, generateInvoiceNumber } = useInvoiceStore();
  const { clients } = useClientStore();
  const { company } = useSettingsStore();

  const isEdit = !!id;
  const printRef = useRef();

  const [taxType, setTaxType] = useState('CGST_SGST');

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientId: '',
    status: 'Unpaid',
    items: [{ id: uuidv4(), name: '', qty: 1, price: 0, gstRate: 18 }]
  });

  useEffect(() => {
    if (isEdit) {
      const existing = invoices.find(inv => inv.id === id);
      if (existing) {
        setInvoice(existing);
      } else {
        navigate('/invoices');
      }
    } else {
      setInvoice(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
    }
  }, [id, invoices, isEdit, navigate, generateInvoiceNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', qty: 1, price: 0, gstRate: 18 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const handleSave = () => {
    if (!invoice.clientId) {
      alert('Please select a client');
      return;
    }
    if (isEdit) {
      updateInvoice(id, invoice);
    } else {
      addInvoice(invoice);
    }
    navigate('/invoices');
  };

  const handleDownload = () => {
    if (!invoice.clientId) {
      alert('Please select a client before downloading');
      return;
    }
    const filename = `${company.name.replace(/\s+/g, '_')}_${invoice.invoiceNumber}.pdf`;
    generateInvoicePdf(printRef.current, filename);
  };

  const selectedClient = clients.find(c => c.id === invoice.clientId) || null;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8">
      {/* Top Bar */}
      <div className="flex-none h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/invoices')}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? `Edit ${invoice.invoiceNumber}` : 'New Invoice'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Invoice
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Left Pane */}
        <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0 bg-slate-50 dark:bg-dark-bg border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-6 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Invoice Number</label>
                <input 
                  type="text" 
                  name="invoiceNumber"
                  value={invoice.invoiceNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Client</label>
                <select 
                  name="clientId"
                  value={invoice.clientId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                  required
                >
                  <option value="">Select a Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Invoice Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={invoice.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                <input 
                  type="date" 
                  name="dueDate"
                  value={invoice.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Tax Mode</label>
              <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden p-1">
                <button 
                  onClick={() => setTaxType('CGST_SGST')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${taxType === 'CGST_SGST' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  CGST + SGST
                </button>
                <button 
                  onClick={() => setTaxType('IGST')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${taxType === 'IGST' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  IGST
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Line Items</h2>
            
            <div className="space-y-3">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="relative bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-12 gap-3 group">
                  <div className="col-span-12 sm:col-span-12">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Item Description</label>
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="e.g. Web Design Service"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Qty</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white text-right"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Price</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white text-right"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-4">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">GST %</label>
                    <select 
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none dark:text-white"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  
                  {invoice.items.length > 1 && (
                    <button 
                      onClick={() => removeItem(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {/* Mobile delete button */}
                  {invoice.items.length > 1 && (
                    <button 
                      onClick={() => removeItem(index)}
                      className="sm:hidden absolute top-4 right-4 text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-teal-200 dark:border-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Another Line Item
            </button>
            
          </div>
          
        </div>

        {/* Live Preview Pane */}
        <div className="hidden lg:flex flex-1 bg-[#525659] dark:bg-black items-start justify-center overflow-y-auto p-12">
          <div className="relative shadow-2xl transition-all duration-300 origin-top" style={{ transform: 'scale(0.8) translateY(-40px)', width: '210mm' }}>
             {/* The hidden A4 Template that will be printed */}
            <InvoiceTemplate 
              ref={printRef}
              invoice={invoice} 
              company={company} 
              client={selectedClient || { name: 'Client Name', address: 'Client Address...' }} 
              taxType={taxType}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
