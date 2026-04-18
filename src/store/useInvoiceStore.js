import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const useInvoiceStore = create(
  persist(
    (set, get) => ({
      invoices: [],
      
      generateInvoiceNumber: () => {
        const { invoices } = get();
        const count = invoices.length + 1;
        return `INV-${count.toString().padStart(3, '0')}`;
      },

      addInvoice: (invoiceData) => set((state) => {
        const newInvoice = {
          id: uuidv4(),
          invoiceNumber: state.generateInvoiceNumber(),
          date: format(new Date(), 'yyyy-MM-dd'),
          dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 15 days default
          status: 'Unpaid',
          items: [{ id: uuidv4(), name: '', qty: 1, price: 0, gstRate: 18 }],
          ...invoiceData
        };
        return { invoices: [...state.invoices, newInvoice] };
      }),
      
      updateInvoice: (id, invoiceData) => set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? { ...inv, ...invoiceData } : inv)
      })),
      
      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
      })),

      updateStatus: (id, status) => set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? { ...inv, status } : inv)
      })),
    }),
    {
      name: 'invoices-storage',
    }
  )
);
