// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Kantumruy_Pro } from 'next/font/google';
import localFont from 'next/font/local';
import { supabase } from '@/lib/supabase/client'; // Adjust path if your client is elsewhere

const kantumruyPro = Kantumruy_Pro({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

const brownSugar = localFont({
  src: '../../../public/BrownSugar.ttf',
  display: 'swap',
});

type Registration = {
  id: string;
  created_at: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  // If you save guests as a JSON object/array in Supabase, you can type it here
  guests?: any[]; 
};

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const fontClass = kantumruyPro.className;

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      // Change 'registrations' to whatever your actual Supabase table is named!
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF9F6] text-stone-900 font-light ${fontClass}`}>
      {/* HEADER */}
      <header className="bg-white border-b border-stone-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className={`${brownSugar.className} text-2xl tracking-wide`}>BARE</h1>
          <p className="text-[10px] uppercase text-stone-500 tracking-[0.2em] mt-1">Admin Dashboard</p>
        </div>
        <div className="flex gap-4 text-sm text-stone-600">
          <div className="text-right">
            <p className="font-medium text-stone-900">{registrations.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone-500">Total Guests</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-normal tracking-tight mb-2">Registration List</h2>
            <p className="text-stone-500 text-sm">Review and manage your event attendees.</p>
          </div>
          <button 
            onClick={fetchRegistrations}
            className="text-[10px] uppercase tracking-[0.2em] border border-stone-300 px-4 py-2 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all"
          >
            Refresh Data
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-[0.15em] text-stone-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Full Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-400 tracking-widest uppercase text-xs">
                      Loading Data...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-400 tracking-widest uppercase text-xs">
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 text-stone-500">
                        {new Date(reg.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-900">{reg.fullName}</td>
                      <td className="px-6 py-4 text-stone-600">{reg.email}</td>
                      <td className="px-6 py-4 text-stone-600">{reg.phone}</td>
                      <td className="px-6 py-4 text-stone-600">{reg.company || '-'}</td>
                      <td className="px-6 py-4 text-stone-500 max-w-[200px] truncate" title={reg.notes}>
                        {reg.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}