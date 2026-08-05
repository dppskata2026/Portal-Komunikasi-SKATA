import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Info
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SahabatSkataChatProps {
  mode?: 'standalone' | 'widget';
  onClose?: () => void;
  onBack?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Bagaimana cara membuat e-KTA Digital SKATA?',
  'Apa saja hak & fasilitas kesejahteraan anggota?',
  'Bagaimana alur pengajuan konsultasi & advokasi hukum?',
  'Siapa saja susunan Pengurus DPP SKATA 2026–2028?',
  'Bagaimana menyampaikan aspirasi & aduan anggota?'
];

export function SahabatSkataChat({ mode = 'standalone', onClose, onBack }: SahabatSkataChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Salam SKATA! **Solid, Mandiri, Sejahtera!** ✊\n\nSaya **Sahabat SKATA**, asisten AI cerdas resmi Serikat Karyawan GSD.\n\nAda yang bisa saya bantu hari ini terkait layanan keanggotaan, e-KTA, advokasi hukum, iuran, atau program kerja SKATA?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Prepare history for backend API
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem.');
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Maaf, saya tidak dapat memproses tanggapan saat ini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Mohon maaf**: ${err.message || 'Layanan Sahabat SKATA AI sedang mengalami gangguan koneksi. Silakan coba beberapa saat lagi.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard error in restricted iframe
    }
  };

  const handleReset = () => {
    if (window.confirm('Bersihkan riwayat percakapan dengan Sahabat SKATA?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Percakapan telah diperbarui. Silakan ajukan pertanyaan baru Anda seputar SKATA!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Helper to render bold markdown and paragraphs
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Format bold text **word**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={lineIdx} className="skata-chat-li">
            {formattedParts.slice(1)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={line.trim() === '' ? 'skata-chat-spacer' : 'skata-chat-p'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={`skata-chat-container ${mode} ${isExpanded ? 'expanded' : ''}`}
    >
      {/* Header */}
      <div className="skata-chat-header">
        <div className="skata-chat-brand">
          {mode === 'standalone' && onBack && (
            <button className="skata-chat-icon-btn back-btn" onClick={onBack} title="Kembali">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="skata-bot-avatar-wrapper">
            <div className="skata-bot-avatar">
              <Bot size={22} className="skata-bot-icon" />
            </div>
            <span className="skata-status-dot" title="Sistem AI Aktif" />
          </div>
          <div className="skata-chat-title">
            <div className="skata-title-row">
              <h3>Sahabat SKATA</h3>
              <span className="skata-ai-badge">
                <Sparkles size={11} /> AI Assistant
              </span>
            </div>
            <p>Asisten Virtual Resmi Serikat Karyawan GSD</p>
          </div>
        </div>

        <div className="skata-chat-actions">
          <button
            className="skata-chat-icon-btn"
            onClick={handleReset}
            title="Reset Percakapan"
          >
            <RefreshCw size={16} />
          </button>

          {mode === 'widget' && (
            <>
              <button
                className="skata-chat-icon-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Kecilkan' : 'Perbesar'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              {onClose && (
                <button className="skata-chat-icon-btn close-btn" onClick={onClose} title="Tutup Chat">
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div className="skata-chat-info-banner">
        <ShieldCheck size={14} className="banner-icon" />
        <span>Diperkuat oleh Google Gemini AI. Didesain untuk memberikan informasi akurat seputar SKATA & Ketenagakerjaan.</span>
      </div>

      {/* Messages Body */}
      <div className="skata-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`skata-msg-row ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="skata-msg-avatar">
                <Bot size={16} />
              </div>
            )}

            <div className="skata-msg-bubble-wrapper">
              <div className="skata-msg-bubble">
                {renderFormattedText(msg.content)}
              </div>

              <div className="skata-msg-meta">
                <span className="skata-msg-time">{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    className="skata-copy-btn"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    title="Salin Teks"
                  >
                    {copiedId === msg.id ? <Check size={12} className="copied" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="skata-msg-avatar user">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="skata-msg-row assistant loading">
            <div className="skata-msg-avatar">
              <Bot size={16} />
            </div>
            <div className="skata-msg-bubble-wrapper">
              <div className="skata-msg-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-text">Sahabat SKATA sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && !isLoading && (
        <div className="skata-chat-suggestions">
          <div className="suggestions-header">
            <HelpCircle size={13} />
            <span>Rekomendasi Pertanyaan Sering Diajukan:</span>
          </div>
          <div className="suggestions-grid">
            {SUGGESTED_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(promptText)}
              >
                <span>{promptText}</span>
                <ChevronRight size={13} className="chip-arrow" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        className="skata-chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="skata-chat-input"
          placeholder="Tanyakan sesuatu pada Sahabat SKATA..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="skata-chat-send-btn"
          disabled={!input.trim() || isLoading}
          title="Kirim Pesan"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default SahabatSkataChat;
