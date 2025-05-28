import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useContactStore } from '../../store/contactStore';
import type { UserRole } from '../../types/contact';

export const RoleSwitcher = () => {
  const { currentUser, setCurrentUser } = useContactStore();

  const toggleRole = () => {
    const newRole: UserRole = currentUser.role === 'admin' ? 'viewer' : 'admin';
    setCurrentUser({
      ...currentUser,
      role: newRole,
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600">Current role:</span>
      <Badge 
        variant={currentUser.role === 'admin' ? 'default' : 'secondary'}
        className="capitalize"
      >
        {currentUser.role}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleRole}
        className="text-xs"
      >
        Switch to {currentUser.role === 'admin' ? 'Viewer' : 'Admin'}
      </Button>
    </div>
  );
};
