import { useEffect } from 'react';
import { ContactList } from './ContactList';
import { ContactFilters } from './ContactFilters';
import { ContactModal } from './ContactModal';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';

export const ContactsPage = () => {
  const { loadContacts, openModal, currentUser } = useContactStore();

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <RoleSwitcher />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <ContactFilters />
        {currentUser.role !== 'viewer' && (
          <Button
            onClick={() => openModal()}
            className="flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        )}
      </div>

      <ContactList />
      <ContactModal />
    </div>
  );
};
