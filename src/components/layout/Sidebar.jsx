import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, X } from 'lucide-react';

export default function Sidebar({ closeMobile }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-slate-700 h-full min-h-screen flex flex-col">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
          InvoiceGen
        </span>
        <button className="md:hidden text-slate-500" onClick={closeMobile}>
          <X className="w-5 h-5"/>
        </button>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
