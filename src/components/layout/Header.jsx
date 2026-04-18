import { Menu, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useEffect } from 'react';

export default function Header({ toggleMobileMenu }) {
  const { theme, toggleTheme } = useSettingsStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <header className="h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="md:hidden text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
          InvoiceGen
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 border border-teal-200 flex items-center justify-center overflow-hidden">
          <span className="text-teal-700 dark:text-teal-300 font-bold text-sm">IG</span>
        </div>
      </div>
    </header>
  );
}
