import { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ invoice, company, client, taxType }, ref) => {
  if (!invoice || !company || !client) return null;

  // Calculations
  const calculations = invoice.items.reduce((acc, item) => {
    const lineTotal = item.qty * item.price;
    const gstAmount = lineTotal * (item.gstRate / 100);
    acc.subtotal += lineTotal;
    acc.totalGst += gstAmount;
    acc.grandTotal += lineTotal + gstAmount;
    return acc;
  }, { subtotal: 0, totalGst: 0, grandTotal: 0 });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div 
      ref={ref}
      className="bg-white text-black text-sm p-10 font-sans mx-auto grid grid-rows-[auto_auto_1fr_auto]"
      style={{ width: '210mm', minHeight: '296mm', height: '100%', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
        <div>
          {company.logoUrl && (
            <img 
              src={company.logoUrl} 
              alt="Company Logo" 
              className="max-w-[150px] max-h-[80px] object-contain mb-4" 
            />
          )}
          <h1 className="text-4xl font-bold tracking-tighter text-slate-800 mb-2">INVOICE</h1>
          <div className="text-slate-500 font-medium">#{invoice.invoiceNumber}</div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-800">{company.name}</h2>
          <div className="text-slate-600 mt-1 whitespace-pre-wrap">{company.address}</div>
          <div className="text-slate-600 mt-1">GSTIN: {company.gstin}</div>
          <div className="text-slate-600">{company.email}</div>
          <div className="text-slate-600">{company.phone}</div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex justify-between mb-8">
        <div className="space-y-1">
          <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Bill To:</div>
          <h3 className="font-bold text-lg text-slate-800">{client.name}</h3>
          <div className="text-slate-600 whitespace-pre-wrap">{client.address}</div>
          {client.gstin && <div className="text-slate-600 mt-1">GSTIN: {client.gstin}</div>}
          {client.phone && <div className="text-slate-600">{client.phone}</div>}
        </div>
        <div className="text-right space-y-2">
          <div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Invoice Date</div>
            <div className="font-medium text-slate-800">{invoice.date}</div>
          </div>
          <div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Due Date</div>
            <div className="font-medium text-slate-800">{invoice.dueDate}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider border-b">Item Description</th>
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider border-b text-right w-20">Qty</th>
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider border-b text-right w-28">Rate</th>
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider border-b text-right w-20">GST %</th>
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider border-b text-right w-32">Amount ({taxType === 'IGST' ? 'IGST' : 'CGST+SGST'})</th>
            </tr>
          </thead>
          <tbody className="align-top border-b border-slate-200">
            {invoice.items.map((item, idx) => {
              const lineTotal = item.qty * item.price;
              const gstAmt = lineTotal * (item.gstRate / 100);
              return (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{item.name || '---'}</div>
                  </td>
                  <td className="py-3 px-3 text-right">{item.qty}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-3 text-right">{item.gstRate}%</td>
                  <td className="py-3 px-3 text-right font-medium">
                    {formatCurrency(lineTotal + gstAmt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-4">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between py-2 text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
            </div>
            
            {taxType === 'IGST' ? (
              <div className="flex justify-between py-2 text-slate-600">
                <span>IGST Total</span>
                <span className="font-medium">{formatCurrency(calculations.totalGst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>CGST Total</span>
                  <span className="font-medium">{formatCurrency(calculations.totalGst / 2)}</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>SGST Total</span>
                  <span className="font-medium">{formatCurrency(calculations.totalGst / 2)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-3 border-t-2 border-slate-800 mt-2 text-lg font-bold text-slate-800">
              <span>Grand Total</span>
              <span>{formatCurrency(calculations.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-8 border-t border-slate-200 text-slate-500 text-xs text-center">
        <p>Thank you for your business.</p>
        <p>Please make payment by {invoice.dueDate}</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
