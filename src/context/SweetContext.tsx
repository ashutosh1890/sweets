import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Sweet } from '@/types/sweet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SweetContextType {
  sweets: Sweet[];
  isLoading: boolean;
  addSweet: (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateSweet: (id: string, updates: Partial<Sweet>) => Promise<boolean>;
  deleteSweet: (id: string) => Promise<boolean>;
  purchaseSweet: (id: string, quantity?: number) => Promise<boolean>;
  restockSweet: (id: string, quantity: number) => Promise<boolean>;
  getSweet: (id: string) => Sweet | undefined;
  refreshSweets: () => Promise<void>;
}

const SweetContext = createContext<SweetContextType | undefined>(undefined);

export function SweetProvider({ children }: { children: ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchSweets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sweets:', error);
        return;
      }

      setSweets(data.map(sweet => ({
        ...sweet,
        price: parseFloat(sweet.price as unknown as string),
      })));
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSweets();
    }
  }, [isAuthenticated, fetchSweets]);

  const refreshSweets = useCallback(async () => {
    await fetchSweets();
  }, [fetchSweets]);

  const addSweet = useCallback(async (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sweets')
        .insert([sweetData]);

      if (error) {
        console.error('Error adding sweet:', error);
        return false;
      }

      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error adding sweet:', error);
      return false;
    }
  }, [fetchSweets]);

  const updateSweet = useCallback(async (id: string, updates: Partial<Sweet>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating sweet:', error);
        return false;
      }

      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error updating sweet:', error);
      return false;
    }
  }, [fetchSweets]);

  const deleteSweet = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting sweet:', error);
        return false;
      }

      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error deleting sweet:', error);
      return false;
    }
  }, [fetchSweets]);

  const purchaseSweet = useCallback(async (id: string, quantity: number = 1): Promise<boolean> => {
    if (!user) return false;

    try {
      const sweet = sweets.find(s => s.id === id);
      if (!sweet || sweet.quantity < quantity) return false;

      // Update stock
      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity - quantity })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating stock:', updateError);
        return false;
      }

      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          sweet_id: id,
          quantity,
          total_price: sweet.price * quantity,
        }]);

      if (orderError) {
        console.error('Error creating order:', orderError);
        // Rollback stock update
        await supabase
          .from('sweets')
          .update({ quantity: sweet.quantity })
          .eq('id', id);
        return false;
      }

      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      return false;
    }
  }, [sweets, user, fetchSweets]);

  const restockSweet = useCallback(async (id: string, quantity: number): Promise<boolean> => {
    try {
      const sweet = sweets.find(s => s.id === id);
      if (!sweet) return false;

      const { error } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity + quantity })
        .eq('id', id);

      if (error) {
        console.error('Error restocking sweet:', error);
        return false;
      }

      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error restocking sweet:', error);
      return false;
    }
  }, [sweets, fetchSweets]);

  const getSweet = useCallback((id: string) => {
    return sweets.find(sweet => sweet.id === id);
  }, [sweets]);

  return (
    <SweetContext.Provider value={{ 
      sweets, 
      isLoading,
      addSweet, 
      updateSweet, 
      deleteSweet, 
      purchaseSweet, 
      restockSweet,
      getSweet,
      refreshSweets,
    }}>
      {children}
    </SweetContext.Provider>
  );
}

export function useSweets() {
  const context = useContext(SweetContext);
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
}
