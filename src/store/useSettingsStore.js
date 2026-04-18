import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      
      company: {
        name: 'My Company',
        email: 'hello@mycompany.com',
        phone: '+91 9876543210',
        address: '123 Business Avenue, Tech Park, City - 123456',
        gstin: '22AAAAA0000A1Z5',
        logoUrl: '',
      },
      updateCompany: (companyData) => set((state) => ({ company: { ...state.company, ...companyData } })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
