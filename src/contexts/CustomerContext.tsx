import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Customer } from '../lib/supabase';
import { customerService } from '../lib/customerService';
import { useAuth } from './AuthContext';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  createCustomer: (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Customer>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (customerId: string) => Promise<void>;
  getCustomer: (customerId: string) => Customer | undefined;
}

export const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getCustomers(user.id);
      setCustomers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createCustomer = async (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not logged in');

    try {
      setError(null);
      const newCustomer = await customerService.createCustomer(user.id, data);
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create customer';
      setError(message);
      throw err;
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    if (!user) throw new Error('User not logged in');

    try {
      setError(null);
      const updated = await customerService.updateCustomer(customerId, user.id, updates);
      setCustomers(prev =>
        prev.map(c => c.id === customerId ? updated : c)
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update customer';
      setError(message);
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!user) throw new Error('User not logged in');

    try {
      setError(null);
      await customerService.deleteCustomer(customerId, user.id);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete customer';
      setError(message);
      throw err;
    }
  };

  const getCustomer = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      error,
      fetchCustomers,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomer,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomers must be used within CustomerProvider');
  return context;
};
