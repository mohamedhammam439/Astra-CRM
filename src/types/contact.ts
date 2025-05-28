export interface Contact {
    id: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ContactFormData {
    name: string;
    email: string;
    company: string;
    phone: string;
  }
  
  export interface ContactFilters {
    search: string;
    company: string;
  }
  
  export type UserRole = 'admin' | 'viewer';
  
  export interface User {
    id: string;
    name: string;
    role: UserRole;
  }
  