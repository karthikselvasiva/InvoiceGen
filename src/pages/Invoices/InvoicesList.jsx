import { useInvoiceStore } from '../../store/useInvoiceStore';
import { useClientStore } from '../../store/useClientStore';
import { Plus, Edit2, Trash2, Download, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function InvoicesList() {
  const { invoices, deleteInvoice, updateStatus } = useInvoiceStore();
  const { clients } = useClientStore();
  const navigate = useNavigate();

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const lineTotal = item.qty * item.price;
      return sum + lineTotal + (lineTotal * (item.gstRate / 100));
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Unpaid': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track your invoices</p>
        </div>
        <Link 
          to="/invoices/new"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </Link>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Invoice No</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Client</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date Issued</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No invoices found. Create your first invoice!
                  </td>
                </tr>
              ) : (
                [...invoices].reverse().map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {getClientName(inv.clientId)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {inv.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {formatCurrency(calculateTotal(inv.items))}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={inv.status}
                        onChange={(e) => updateStatus(inv.id, e.target.value)}
                        className={`text-sm font-medium rounded-full px-2.5 py-1 border-none focus:ring-0 ${getStatusColor(inv.status)}`}
                      >
                        <option value="Paid" className="bg-white text-slate-900">Paid</option>
                        <option value="Unpaid" className="bg-white text-slate-900">Unpaid</option>
                        <option value="Overdue" className="bg-white text-slate-900">Overdue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/invoices/edit/${inv.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Delete this invoice?')) deleteInvoice(inv.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
