"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search } from "lucide-react";
import { sendMessage, markAsRead } from "@/lib/actions/messages";
import { getInitials } from "@/lib/utils";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Profile {
  name: string;
  avatar: string | null;
  role: string;
}

interface Props {
  currentUserId: string;
  initialMessages: Message[];
  profiles: Record<string, Profile>;
  selectedUserId?: string;
}

export default function MessagesClient({ currentUserId, initialMessages, profiles, selectedUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeUser, setActiveUser] = useState<string | null>(selectedUserId || null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by user
  const conversations = React.useMemo(() => {
    const grouped: Record<string, Message[]> = {};
    messages.forEach(msg => {
      const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!grouped[otherId]) grouped[otherId] = [];
      grouped[otherId].push(msg);
    });

    // Sort messages in each conversation by time
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
    return grouped;
  }, [messages, currentUserId]);

  // Determine conversation list (sorted by latest message)
  const contactList = Object.keys(conversations).sort((a, b) => {
    const lastMsgA = conversations[a][conversations[a].length - 1];
    const lastMsgB = conversations[b][conversations[b].length - 1];
    return new Date(lastMsgB.created_at).getTime() - new Date(lastMsgA.created_at).getTime();
  });

  // If selectedUser is not in contacts but passed via URL, add them
  if (selectedUserId && !contactList.includes(selectedUserId) && profiles[selectedUserId]) {
    contactList.unshift(selectedUserId);
  }

  const activeMessages = activeUser && conversations[activeUser] ? conversations[activeUser] : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Mark as read when active user changes
  useEffect(() => {
    if (activeUser) {
      const unreadCount = activeMessages.filter(m => m.receiver_id === currentUserId && !m.is_read).length;
      if (unreadCount > 0) {
        markAsRead(activeUser).then(() => {
          setMessages(prev => prev.map(m => 
            (m.sender_id === activeUser && m.receiver_id === currentUserId) ? { ...m, is_read: true } : m
          ));
        });
      }
    }
  }, [activeUser, activeMessages, currentUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;

    setLoading(true);
    const content = inputText;
    setInputText("");

    // Optimistic UI update
    const tempMsg: Message = {
      id: Math.random().toString(),
      sender_id: currentUserId,
      receiver_id: activeUser,
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    await sendMessage(activeUser, content);
    setLoading(false);
  };

  return (
    <div className="flex h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* LEFT: Contacts Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/50">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contactList.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm mt-10">
              No conversations yet.
            </div>
          ) : (
            contactList.map(contactId => {
              const prof = profiles[contactId];
              const lastMsg = conversations[contactId]?.[conversations[contactId].length - 1];
              const unread = conversations[contactId]?.filter(m => m.receiver_id === currentUserId && !m.is_read).length || 0;

              if (!prof) return null; // If profile wasn't fetched somehow

              return (
                <button
                  key={contactId}
                  onClick={() => setActiveUser(contactId)}
                  className={`w-full text-left p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 ${activeUser === contactId ? 'bg-slate-800/50 relative' : ''}`}
                >
                  {activeUser === contactId && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                  
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {prof.avatar ? (
                      <img src={prof.avatar} alt={prof.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-slate-400">{getInitials(prof.name)}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-white text-sm truncate pr-2">{prof.name}</h3>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(lastMsg.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className={`text-xs truncate ${unread > 0 ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
                        {lastMsg.sender_id === currentUserId ? 'You: ' : ''}{lastMsg.content}
                      </p>
                    )}
                  </div>
                  
                  {unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {unread}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-900 relative">
        {activeUser && profiles[activeUser] ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/30">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                {profiles[activeUser].avatar ? (
                  <img src={profiles[activeUser].avatar!} alt={profiles[activeUser].name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-slate-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{profiles[activeUser].name}</h3>
                <p className="text-xs text-emerald-400 capitalize">{profiles[activeUser].role}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-slate-600" />
                  </div>
                  <p>Send a message to start the conversation.</p>
                </div>
              ) : (
                activeMessages.map((msg, idx) => {
                  const isMe = msg.sender_id === currentUserId;
                  const showTime = idx === 0 || new Date(msg.created_at).getTime() - new Date(activeMessages[idx-1].created_at).getTime() > 1000 * 60 * 5; // 5 min gap
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {showTime && (
                        <span className="text-[10px] text-slate-500 my-2">
                          {new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      <div 
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm shadow-md shadow-emerald-500/10' 
                            : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="h-11 w-11 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 shrink-0"
                >
                  <Send className="h-5 w-5 ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
