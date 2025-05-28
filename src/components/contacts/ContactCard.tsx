import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import type { Contact } from '../../types/contact';
import { useContactStore } from '../../store/contactStore';
import { Mail, User, X } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { openModal, deleteContact, currentUser } = useContactStore();

  const handleDelete = async () => {
    try {
      await deleteContact(contact.id);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  const handleEdit = () => {
    if (currentUser.role === 'viewer') {
      alert("You don't have permission to edit contacts.");
      return;
    }
    openModal(contact);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{contact.email}</span>
              </div>
              
              {contact.company && (
                <Badge variant="secondary" className="text-xs">
                  {contact.company}
                </Badge>
              )}
              
              {contact.phone && (
                <p className="text-sm text-gray-600">{contact.phone}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              disabled={currentUser.role === 'viewer'}
              className="h-8 w-8 p-0"
            >
              <User className="h-3 w-3" />
            </Button>
            {currentUser.role === 'admin' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {contact.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Updated {contact.updatedAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
