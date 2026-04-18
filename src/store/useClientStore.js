import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useClientStore = create(
  persist(
    (set) => ({
      clients: [
        {
          id: 'default-acme-corp-id-1',
          name: 'Acme Corp',
          email: 'accounts@acmecorp.com',
          phone: '+91 9988776655',
          address: '456 Client St, Metro City - 654321',
          gstin: '33BBBBB0000B2Z1'
        }
      ],
      
      addClient: (clientData) => set((state) => ({
        clients: [...state.clients, { id: uuidv4(), ...clientData }]
      })),
      
      updateClient: (id, clientData) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...clientData } : c)
      })),
      
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'clients-storage',
    }
  )
);
