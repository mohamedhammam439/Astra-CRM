import type { Contact, ContactFormData } from '../types/contact';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    company: 'Acme Corp',
    phone: '+1 (555) 123-4567',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@techstart.io',
    company: 'TechStart',
    phone: '+1 (555) 987-6543',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@globalinc.com',
    company: 'Global Inc',
    phone: '+1 (555) 456-7890',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

export class ContactService {
  private static contacts: Contact[] = [...mockContacts];

  static async getContacts(): Promise<Contact[]> {
    await delay(500);
    return [...this.contacts];
  }

  static async createContact(data: ContactFormData): Promise<Contact> {
    await delay(300);
    const newContact: Contact = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contacts.push(newContact);
    return newContact;
  }

  static async updateContact(id: string, data: ContactFormData): Promise<Contact> {
    await delay(300);
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    const updatedContact = {
      ...this.contacts[index],
      ...data,
      updatedAt: new Date(),
    };
    this.contacts[index] = updatedContact;
    return updatedContact;
  }

  static async deleteContact(id: string): Promise<void> {
    await delay(300);
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    this.contacts.splice(index, 1);
  }
}
