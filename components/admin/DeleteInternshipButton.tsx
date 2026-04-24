'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteInternshipButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you certain you want to delete this internship? This will also remove associated projects and cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/internships/${id}`, {
        method: 'DELETE',
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete');
      
      toast.success('Internship deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex p-2 text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50"
      title="Delete Internship"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
