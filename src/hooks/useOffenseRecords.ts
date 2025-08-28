import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export interface DatabaseOffenseRecord {
  id: string;
  student_name: string;
  student_grade: number;
  student_class: string;
  offense_type: string;
  offense_description: string | null;
  created_at: string;
  recorded_by: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
  } | null;
}

export const useOffenseRecords = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const [records, setRecords] = useState<DatabaseOffenseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecords();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('offense-records-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'offense_records'
          },
          () => {
            fetchRecords();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  const fetchRecords = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('offense_records')
        .select(`
          *,
          profiles!offense_records_recorded_by_fkey(full_name, department)
        `)
        .order('created_at', { ascending: false });

      // If not admin, only show records created by the current user
      if (!isAdmin()) {
        query = query.eq('recorded_by', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching offense records:', error);
        return;
      }

      setRecords((data as any) || []);
    } catch (error) {
      console.error('Error fetching offense records:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase
      .from('offense_records')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    await fetchRecords();
  };

  const updateRecord = async (id: string, updates: Partial<DatabaseOffenseRecord>) => {
    const { error } = await supabase
      .from('offense_records')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    await fetchRecords();
  };

  return {
    records,
    loading,
    refetch: fetchRecords,
    deleteRecord,
    updateRecord
  };
};