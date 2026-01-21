'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadUsers() {
      const res = await fetch('/api/users');
      const json = await res.json();
      setUsers(json.data);
      setLoading(false);
    }

    loadUsers();
  }, [user, router]);


  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // evita hydration mismatch
  if (!mounted) {
    return null; // ou um loader
  }

  if (!user) return null;

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Users from your condominium
      </h1>

      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="border p-3 rounded">
            <p className="font-medium">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
