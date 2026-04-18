import { useInvoiceStore } from '../store/useInvoiceStore';
import { useClientStore } from '../store/useClientStore';
import { FileText, Users, IndianRupee, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { invoices } = useInvoiceStore();
  const { clients } = useClientStore();

  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  
  // Computation for dashboard
  const stats = invoices.reduce((acc, inv) => {
    // Calculate total for an invoice
    const invTotal = inv.items.reduce((sum, item) => {
      const lineTotal = item.qty * item.price;
      const gstAmount = lineTotal * (item.gstRate / 100);
      return sum + lineTotal + gstAmount;
    }, 0);

    if (inv.status === 'Paid') {
      acc.revenue += invTotal;
      acc.paid += 1;
    } else if (inv.status === 'Overdue') {
      acc.pending += invTotal;
      acc.overdue += 1;
    } else {
      acc.pending += invTotal;
      acc.unpaid += 1;
    }

    return acc;
  }, { revenue: 0, pending: 0, paid: 0, unpaid: 0, overdue: 0 });

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your invoice activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Amount</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.pending)}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Invoices</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalInvoices}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Clients</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalClients}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Paid</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.paid}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><Clock className="w-4 h-4 text-amber-500" /> Unpaid</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.unpaid}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><AlertCircle className="w-4 h-4 text-red-500" /> Overdue</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.overdue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Invoice No</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Client</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                [...invoices].reverse().slice(0, 5).map(inv => {
                  const client = clients.find(c => c.id === inv.clientId);
                  const total = inv.items.reduce((sum, item) => {
                    const lineTotal = item.qty * item.price;
                    return sum + lineTotal + (lineTotal * (item.gstRate / 100));
                  }, 0);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{client ? client.name : 'Unknown Client'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{inv.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white text-right">
                        {formatCurrency(total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
