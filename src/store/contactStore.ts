import { create } from 'zustand';
import type { Contact, ContactFormData, ContactFilters, User } from '../types/contact';
import { ContactService } from '../services/contactService';

interface ContactState {
  // Data
  contacts: Contact[];
  filteredContacts: Contact[];
  currentUser: User;
  
  // UI State
  isLoading: boolean;
  isModalOpen: boolean;
  editingContact: Contact | null;
  filters: ContactFilters;
  
  // Actions
  loadContacts: () => Promise<void>;
  createContact: (data: ContactFormData) => Promise<void>;
  updateContact: (id: string, data: ContactFormData) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // UI Actions
  openModal: (contact?: Contact) => void;
  closeModal: () => void;
  setFilters: (filters: Partial<ContactFilters>) => void;
  setCurrentUser: (user: User) => void;
  
  // Helpers
  applyFilters: () => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  // Initial state
  contacts: [],
  filteredContacts: [],
  currentUser: { id: '1', name: 'Admin User', role: 'admin' },
  isLoading: false,
  isModalOpen: false,
  editingContact: null,
  filters: { search: '', company: '' },

  // Load contacts
  loadContacts: async () => {
    console.log('Loading contacts...');
    set({ isLoading: true });
    try {
      const contacts = await ContactService.getContacts();
      console.log('Loaded contacts:', contacts);
      set({ contacts });
      get().applyFilters();
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create contact with optimistic update
  createContact: async (data: ContactFormData) => {
    console.log('Creating contact with data:', data);
    const tempId = `temp-${Date.now()}`;
    const optimisticContact: Contact = {
      id: tempId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    const currentContacts = get().contacts;
    console.log('Current contacts before create:', currentContacts);
    set({ contacts: [...currentContacts, optimisticContact] });
    get().applyFilters();

    try {
      const newContact = await ContactService.createContact(data);
      console.log('Contact created successfully:', newContact);
      // Replace optimistic contact with real one using current state
      set(state => ({
        contacts: state.contacts.map(c => 
          c.id === tempId ? newContact : c
        )
      }));
      get().applyFilters();
    } catch (error) {
      console.error('Failed to create contact:', error);
      // Revert optimistic update
      set({ contacts: currentContacts });
      get().applyFilters();
      throw error;
    }
  },

  // Update contact with optimistic update
  updateContact: async (id: string, data: ContactFormData) => {
    console.log('Updating contact:', id, data);
    const currentContacts = get().contacts;
    const oldContact = currentContacts.find(c => c.id === id);
    if (!oldContact) return;

    // Optimistic update
    const optimisticContact = { ...oldContact, ...data, updatedAt: new Date() };
    set({
      contacts: currentContacts.map(c => c.id === id ? optimisticContact : c)
    });
    get().applyFilters();

    try {
      const updatedContact = await ContactService.updateContact(id, data);
      console.log('Contact updated successfully:', updatedContact);
      set({
        contacts: currentContacts.map(c => c.id === id ? updatedContact : c)
      });
      get().applyFilters();
    } catch (error) {
      console.error('Failed to update contact:', error);
      // Revert optimistic update
      set({ contacts: currentContacts });
      get().applyFilters();
      throw error;
    }
  },

  // Delete contact with optimistic update
  deleteContact: async (id: string) => {
    console.log('Deleting contact:', id);
    const currentContacts = get().contacts;
    
    // Optimistic update
    set({ contacts: currentContacts.filter(c => c.id !== id) });
    get().applyFilters();

    try {
      await ContactService.deleteContact(id);
      console.log('Contact deleted successfully');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      // Revert optimistic update
      set({ contacts: currentContacts });
      get().applyFilters();
      throw error;
    }
  },

  // Modal actions
  openModal: (contact?: Contact) => {
    console.log('Opening modal with contact:', contact);
    set({ isModalOpen: true, editingContact: contact || null });
  },

  closeModal: () => {
    console.log('Closing modal');
    set({ isModalOpen: false, editingContact: null });
  },

  // Filter actions
  setFilters: (newFilters: Partial<ContactFilters>) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().applyFilters();
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
  },

  // Apply filters
  applyFilters: () => {
    const { contacts, filters } = get();
    let filtered = [...contacts];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search) ||
        contact.phone.includes(search)
      );
    }

    if (filters.company) {
      filtered = filtered.filter(contact =>
        contact.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    console.log('Applied filters, filtered contacts:', filtered);
    set({ filteredContacts: filtered });
  },
}));
