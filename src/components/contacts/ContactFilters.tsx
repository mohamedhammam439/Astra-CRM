import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useContactStore } from '../../store/contactStore';
import { Plus, Search } from 'lucide-react';

export const ContactFilters = () => {
  const {
    filters,
    setFilters,
    openModal,
    contacts,
    filteredContacts,
    currentUser,
  } = useContactStore();

  // Get unique companies for filter dropdown
  const companies = Array.from(new Set(contacts.map(c => c.company).filter(Boolean)));

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleCompanyFilter = (value: string) => {
    setFilters({ company: value === 'all' ? '' : value });
  };

  const clearFilters = () => {
    setFilters({ search: '', company: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.company || 'all'} onValueChange={handleCompanyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filters.search || filters.company) && (
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4  sm:justify-between">
          <Badge variant="outline" className="text-sm">
            {filteredContacts.length} contacts
          </Badge>
          
          {/* {currentUser.role !== 'viewer' && (
            <Button 
              onClick={() => openModal()}
              className="flex items-center space-x-2 mt-4 sm:mt-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          )} */}
        </div>
      </div>

      {currentUser.role === 'viewer' && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          You're viewing in read-only mode. Contact an admin to modify contacts.
        </div>
      )}
    </div>
  );
};
