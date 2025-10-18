import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(r => r.role);
    },
    enabled: !!user,
  });

  const isTeacher = roles?.includes('teacher') ?? false;
  const isStudent = roles?.includes('student') ?? false;
  const isAdmin = roles?.includes('admin') ?? false;

  return {
    roles: roles ?? [],
    isTeacher,
    isStudent,
    isAdmin,
    isLoading,
  };
};