'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Image as ImageIcon,
  Sparkles,
  Shield,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export interface ChatMessage {
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  images?: string[];
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  messages: ChatMessage[];
}

export const CustomerSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // New ticket state if no active ticket
  const [subject, setSubject] = useState('Bulk Order & Custom Craft Inquiry');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [category, setCategory] = useState('bulk_order');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read logged-in user if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomerName(parsed.name || '');
          setCustomerEmail(parsed.email || '');
        } catch (_) {}
      }
    }
  }, []);

  const fetchExistingTicket = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.SUPPORT.LIST, {
        headers: { 'x-user-role': 'customer' }
      });
      if (res.data?.data && res.data.data.length > 0) {
        setActiveTicket(res.data.data[0]);
      }
    } catch (_) {
      // No existing ticket
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !activeTicket) {
      fetchExistingTicket();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    setIsSending(true);

    const clientMsg: ChatMessage = {
      sender: 'customer',
      senderName: customerName || 'You',
      text: inputText.trim(),
      images: attachedImage ? [attachedImage] : [],
      createdAt: new Date().toISOString()
    };

    if (activeTicket) {
      try {
        await apiClient.post(
          API_ENDPOINTS.SUPPORT.ADD_MESSAGE(activeTicket._id),
          {
            text: inputText.trim(),
            images: attachedImage ? [attachedImage] : [],
            sender: 'customer',
            senderName: customerName || 'Customer'
          },
          { headers: { 'x-user-role': 'customer' } }
        );

        setActiveTicket(prev =>
          prev ? { ...prev, messages: [...prev.messages, clientMsg] } : null
        );
        setInputText('');
        setAttachedImage('');
      } catch (_) {
        // Local state fallback
        setActiveTicket(prev =>
          prev ? { ...prev, messages: [...prev.messages, clientMsg] } : null
        );
        setInputText('');
        setAttachedImage('');
      } finally {
        setIsSending(false);
      }
    } else {
      // Create new ticket
      try {
        const res = await apiClient.post(
          API_ENDPOINTS.SUPPORT.CREATE,
          {
            customerName: customerName || 'Valued Client',
            customerEmail: customerEmail || 'client@enterprise.in',
            subject,
            category,
            message: inputText.trim(),
            images: attachedImage ? [attachedImage] : []
          },
          { headers: { 'x-user-role': 'customer' } }
        );

        if (res.data?.data) {
          setActiveTicket(res.data.data);
        }
        setInputText('');
        setAttachedImage('');
      } catch (_) {
        setActiveTicket({
          _id: `tkt-${Date.now()}`,
          ticketNumber: `TKT-${Date.now().toString().slice(-6)}`,
          customerName: customerName || 'Client',
          customerEmail: customerEmail || 'client@enterprise.in',
          subject,
          category,
          status: 'open',
          messages: [clientMsg]
        });
        setInputText('');
        setAttachedImage('');
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white rounded-full shadow-2xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-500/30 font-semibold text-xs tracking-wide group"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-amber-200" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-amber-900 animate-pulse" />
            </div>
            <span>Support & Live Chat</span>
          </button>
        )}
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200 font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-700/80 border border-amber-500/40 flex items-center justify-center font-bold text-sm text-amber-100">
                A
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-wide flex items-center gap-1.5">
                  Amba Customer Concierge
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[10px] text-amber-200/80 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online • Typically replies instantly
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
            {activeTicket?.messages.map((msg, idx) => {
              const isMe = msg.sender === 'customer';

              return (
                <div
                  key={idx}
                  className={`flex gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isMe ? 'bg-amber-800 text-white' : 'bg-stone-900 text-white'
                    }`}
                  >
                    {isMe ? <User className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                    <div className="text-[9px] text-stone-400 flex items-center gap-1.5 px-1">
                      <span className="font-semibold text-stone-700">{msg.senderName}</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-amber-800 text-white rounded-tr-none shadow-xs text-left'
                          : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-xs text-left'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Attached Reference Photos */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-black/10">
                          {msg.images.map((img, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-black/10">
                              <img src={img} alt="Shared Reference" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Upload Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 shrink-0 space-y-2">
            {attachedImage && (
              <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl w-fit border border-stone-200">
                <img src={attachedImage} alt="Attachment" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-[11px] text-stone-600">Sample attached</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage('')}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                title="Attach reference product sample"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Ask about bulk pricing, custom crafts..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20"
              />

              <button
                type="submit"
                disabled={isSending || (!inputText.trim() && !attachedImage)}
                className="p-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

