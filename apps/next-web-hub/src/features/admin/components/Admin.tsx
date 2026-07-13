"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, authToken } from '@/infrastructure/http/apiClient';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Phone
} from 'lucide-react';

interface EventData {
  id?: number;
  title: Record<string, string>;
  date: Record<string, string>;
  location: Record<string, string>;
  description: Record<string, string>;
}

interface InquiryData {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  trade: string;
  state: string;
  status: string;
}

const LANGUAGES = ['en', 'hi', 'te'];

import { BaseModal } from '@/shared/ui/BaseModal';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'inquiries'>('events');
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = authToken.get();
    if (token) {
      // Validate token with backend
      api.get<{ id: string }>('auth/me').then(({ data, error }) => {
        if (!error && data) {
          setIsAuthenticated(true);
        } else {
          authToken.clear();
        }
      });
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await api.get<EventData[]>('community/events');
    if (error) console.error('Error fetching events:', error.message);
    else setEvents(data || []);
  }, []);

  const fetchInquiries = useCallback(async () => {
    const { data, error } = await api.get<InquiryData[]>('members/inquiries');
    if (error) console.error('Error fetching inquiries:', error.message);
    else setInquiries(data || []);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      fetchInquiries();
    }
  }, [isAuthenticated, fetchEvents, fetchInquiries]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Use backend OTP-based auth: request OTP first, then verify.
    // For now, attempt login via /auth/login if available, otherwise
    // fall back to a protected admin check via /auth/me with credentials.
    const { data, error } = await api.post<{ accessToken: string }>('auth/login', {
      email,
      password,
    });

    if (!error && data?.accessToken) {
      authToken.set(data.accessToken);
      setIsAuthenticated(true);
    } else {
      alert(
        error?.message ??
          'Login failed. If this is the first time, the admin endpoint may not be configured yet.',
      );
    }
    setLoading(false);
  }

  function handleLogout() {
    authToken.clear();
    setIsAuthenticated(false);
    setEvents([]);
    setInquiries([]);
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    const isNew = !editingEvent.id;

    const { error } = isNew
      ? await api.post('community/events', editingEvent)
      : await api.put(`community/events/${editingEvent.id}`, editingEvent);

    if (error) {
      alert(error.message);
    } else {
      setEditingEvent(null);
      setIsAdding(false);
      fetchEvents();
    }
    setLoading(false);
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const { error } = await api.delete(`community/events/${id}`);
    if (error) alert(error.message);
    else fetchEvents();
  }

  async function handleDeleteInquiry(id: number) {
    if (!confirm('Are you sure you want to remove this inquiry?')) return;
    const { error } = await api.delete(`members/inquiries/${id}`);
    if (error) alert(error.message);
    else fetchInquiries();
  }

  const emptyEvent: EventData = {
    title: { en: '', hi: '', te: '' },
    date: { en: '', hi: '', te: '' },
    location: { en: '', hi: '', te: '' },
    description: { en: '', hi: '', te: '' },
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-saffron-100/50 p-8 border border-stone-100"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-saffron-600 p-4 rounded-2xl">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-center text-stone-900 mb-2 font-display">Admin Portal</h2>
          <p className="text-stone-500 text-center text-sm mb-8">Sign in to manage VKC Community</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 transition-all outline-none font-medium"
                placeholder="admin@vkc-community.org"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 transition-all outline-none font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron-600 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-saffron-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-6 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="bg-saffron-600 p-1.5 sm:p-2 rounded-lg">
              <ShieldCheck className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-black text-stone-900 uppercase tracking-tight text-xs sm:text-sm font-display">VKC Admin Panel</span>
          </motion.div>

          <nav className="hidden sm:flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-100">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-white text-saffron-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'inquiries' ? 'bg-white text-saffron-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Inquiries
              {inquiries.length > 0 && <span className="ml-2 bg-saffron-100 text-saffron-600 px-1.5 py-0.5 rounded-md text-[10px]">{inquiries.length}</span>}
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 sm:gap-2 text-stone-500 hover:text-red-600 font-bold text-xs sm:text-sm transition-colors"
        >
          <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
          Sign Out
        </button>
      </header>

      {/* Mobile Nav */}
      <nav className="sm:hidden flex items-center justify-around bg-white border-b border-stone-100 p-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${activeTab === 'events' ? 'text-saffron-600' : 'text-stone-400'}`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest ${activeTab === 'inquiries' ? 'text-saffron-600' : 'text-stone-400'}`}
        >
          Inquiries ({inquiries.length})
        </button>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">Events Management</h1>
                  <p className="text-stone-500 text-sm">Manage community events and translations</p>
                </div>
                <button
                  onClick={() => { setEditingEvent(emptyEvent); setIsAdding(true); }}
                  className="w-full sm:w-auto bg-saffron-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-saffron-700 transition-all shadow-lg shadow-saffron-600/20"
                >
                  <Plus size={20} />
                  New Event
                </button>
              </div>

              <div className="grid gap-4">
                {events.length === 0 ? (
                  <div className="bg-white border-4 border-dashed border-stone-100 rounded-[2.5rem] p-20 text-center">
                    <Calendar className="text-stone-100 mx-auto mb-4" size={48} />
                    <p className="text-stone-300 font-bold mb-2 uppercase tracking-widest text-sm">No Events in Database</p>
                  </div>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="bg-saffron-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-saffron-600 group-hover:bg-saffron-600 group-hover:text-white transition-all">
                          <Calendar size={24} className="sm:w-[28px] sm:h-[28px]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-saffron-700 transition-colors line-clamp-1 font-display">{event.title.en}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-xs font-bold">
                              <Calendar size={12} className="text-saffron-500" />
                              {event.date.en}
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-xs font-bold">
                              <MapPin size={12} className="text-gold-500" />
                              {event.location.en}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all self-end sm:self-center">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-3 bg-stone-50 text-stone-500 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-all font-bold"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id!)}
                          className="p-3 bg-stone-50 text-stone-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inquiries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">Artisan Inquiries</h1>
                <p className="text-stone-500 text-sm">Review and follow up with interested community members</p>
              </div>

              <div className="grid gap-4">
                {inquiries.length === 0 ? (
                  <div className="bg-white border-4 border-dashed border-stone-100 rounded-[2.5rem] p-20 text-center">
                    <Users className="text-stone-100 mx-auto mb-4" size={48} />
                    <p className="text-stone-300 font-bold mb-2 uppercase tracking-widest text-sm">No Inquiries Found</p>
                  </div>
                ) : (
                  inquiries.map(inquiry => (
                    <div key={inquiry.id} className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="bg-gold-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all">
                          <Users size={24} className="sm:w-[28px] sm:h-[28px]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-gold-700 transition-colors font-display">{inquiry.name}</h3>
                            <span className="text-[8px] font-black uppercase tracking-widest bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{inquiry.status}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-xs font-bold">
                              <Briefcase size={12} className="text-saffron-500" />
                              {inquiry.trade}
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-xs font-bold">
                              <MapPin size={12} className="text-gold-500" />
                              {inquiry.state}
                            </div>
                            <div className="flex items-center gap-1.5 text-saffron-600 text-[10px] sm:text-xs font-black">
                              <Phone size={12} />
                              {inquiry.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all self-end sm:self-center">
                        <button
                          onClick={() => handleDeleteInquiry(inquiry.id)}
                          className="p-3 bg-stone-50 text-stone-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Form Modal */}
        <BaseModal
          isOpen={!!editingEvent || isAdding}
          onClose={() => { setEditingEvent(null); setIsAdding(false); }}
          maxW="max-w-3xl"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-black text-stone-900 mb-8 flex items-center gap-3 font-display">
              {editingEvent?.id ? <Edit2 className="text-saffron-600" /> : <Plus className="text-saffron-600" />}
              {editingEvent?.id ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSaveEvent} className="space-y-6 sm:space-y-8">
              {LANGUAGES.map(l => (
                <div key={l} className="space-y-4 p-4 sm:p-6 bg-stone-50 rounded-2xl sm:rounded-3xl border border-stone-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-saffron-600 border border-saffron-100">
                      {l.toUpperCase()}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-stone-400">{l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Telugu'} Content</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Event Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Annual Vishwakarma Puja"
                        className="w-full bg-white px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all font-medium"
                        value={editingEvent?.title[l] || ''}
                        onChange={(e) => setEditingEvent({...editingEvent!, title: {...editingEvent!.title, [l]: e.target.value}})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Event Date</label>
                      <input
                        type="text"
                        placeholder="e.g. September 17, 2026"
                        className="w-full bg-white px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all font-medium"
                        value={editingEvent?.date[l] || ''}
                        onChange={(e) => setEditingEvent({...editingEvent!, date: {...editingEvent!.date, [l]: e.target.value}})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Temple Hall"
                      className="w-full bg-white px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all font-medium"
                      value={editingEvent?.location[l] || ''}
                      onChange={(e) => setEditingEvent({...editingEvent!, location: {...editingEvent!.location, [l]: e.target.value}})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Tell the community about this event..."
                      className="w-full bg-white px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all font-medium resize-none"
                      value={editingEvent?.description[l] || ''}
                      onChange={(e) => setEditingEvent({...editingEvent!, description: {...editingEvent!.description, [l]: e.target.value}})}
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-saffron-600 text-white py-4 rounded-2xl font-bold hover:bg-saffron-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-saffron-600/20 order-1 sm:order-none"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingEvent(null); setIsAdding(false); }}
                  className="w-full sm:w-auto px-8 bg-stone-100 text-stone-500 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all active:scale-95 order-2 sm:order-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </BaseModal>
      </main>
    </div>
  );
}
