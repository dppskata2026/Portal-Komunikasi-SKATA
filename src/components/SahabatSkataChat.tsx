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
  Info,
  Database,
  BookOpen,
  FileText
} from 'lucide-react';
import { seedRegulationsToFirebase } from '../lib/firestoreService';
import { generateSkataSearchResponse, getRelevantContextForPrompt } from '../lib/skataKnowledgeSearch';

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
  'Apa saja hak cuti tahunan, CAP, & MTM di PKB V 2025–2027?',
  'Bagaimana ketentuan Kenaikan Gaji, THR & Bonus di PKB V?',
  'Apa isi Anggaran Dasar (AD) & Anggaran Rumah Tangga (ART) SKATA?',
  'Bagaimana alur advokasi hukum jika terjadi perselisihan kerja?',
  'Siapa saja Susunan Pengurus DPP & DPW SKATA 2026–2028?'
];

// Local Knowledge Fallback Engine for Sahabat SKATA AI
async function getFallbackAiResponse(query: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const searchedContext = getRelevantContextForPrompt(query);
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      let systemInstruction = `Kamu adalah Sahabat SKATA, Asisten AI Cerdas resmi Serikat Karyawan GSD (PT Graha Sarana Duta / TelkomProperty - Anak Perusahaan PT Telkom Indonesia Tbk). Jawablah setiap pertanyaan dengan sangat ramah, profesional, menyambung, dan akurat berdasarkan regulasi resmi SKATA (PKB V 2025–2027, AD & ART 2026). Gunakan format Markdown yang rapi.`;

      if (searchedContext) {
        systemInstruction += `\n\n${searchedContext}`;
      }

      // Clean up message turns so it starts with user and alternates
      const validMsgs = messages.filter((m) => (m.content || '').trim() !== '');
      let rawList = validMsgs.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        text: m.content.trim()
      }));

      while (rawList.length > 0 && rawList[0].role === 'model') {
        rawList.shift();
      }

      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const item of rawList) {
        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
          formattedContents[formattedContents.length - 1].parts[0].text += `\n${item.text}`;
        } else {
          formattedContents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }

      const candidateModels = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-2.5-pro'];
      for (const modelName of candidateModels) {
        try {
          if (formattedContents.length > 0) {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: { systemInstruction, temperature: 0.7 }
            });
            if (response.text) return response.text;
          }
        } catch (mErr) {
          console.warn(`Client model ${modelName} fallback warning:`, mErr);
        }
      }
    } catch (gErr) {
      console.warn('Client-side Gemini API fallback error, using SKATA Local Knowledge Engine:', gErr);
    }
  }

  // Use Universal Regulation Search Engine
  return generateSkataSearchResponse(query);
}

export function SahabatSkataChat({ mode = 'standalone', onClose, onBack }: SahabatSkataChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊\n\nSaya **Sahabat SKATA**, asisten AI cerdas resmi Serikat Karyawan GSD.\n\nSaya telah terhubung langsung ke **Database Firebase Firestore** yang memuat seluruh dokumen resmi:\n- **Anggaran Dasar (AD) SKATA 2026**\n- **Anggaran Rumah Tangga (ART) SKATA 2026**\n- **Perjanjian Kerja Bersama V (PKB V) SKATA & GSD 2025–2027** (Disahkan Kemenaker RI)\n\nSilakan ajukan pertanyaan seputar hak pekerja, aturan cuti, THR, advokasi, iuran, e-KTA, atau pasal regulasi SKATA!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed and sync regulations database to Firebase Firestore on mount
    seedRegulationsToFirebase().then((success) => {
      if (success) setDbSynced(true);
    });
  }, []);

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

      let replyText = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          replyText = data.reply;
        } else if (contentType.includes('application/json')) {
          const data = await res.json();
          throw new Error(data.error || `Server error ${res.status}`);
        } else {
          // Non-JSON response (e.g., HTML 404 on Vercel/static host)
          throw new Error('Backend API chat unavailable');
        }
      } catch (backendErr) {
        console.warn('Backend API chat unavailable, using Sahabat SKATA Client Knowledge Engine:', backendErr);
        replyText = await getFallbackAiResponse(query.trim(), conversationHistory);
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText || 'Maaf, Sahabat SKATA belum dapat memberikan jawaban saat ini.',
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

      {/* Info Notice & Database Reference Indicator */}
      <div className="skata-chat-info-banner flex-col gap-1.5 align-start" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 16px', background: 'rgba(2, 132, 199, 0.08)', borderBottom: '1px solid rgba(2, 132, 199, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--skata-navy)' }}>
          <Database size={14} style={{ color: '#0284c7' }} />
          <span>Database Referensi: Firebase Firestore (AD, ART & PKB V SKATA)</span>
          <span style={{ marginLeft: 'auto', fontSize: '10px', background: dbSynced ? '#dcfce7' : '#fef3c7', color: dbSynced ? '#15803d' : '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
            {dbSynced ? '● Database Firestore Aktif' : '○ Menghubungkan Firebase...'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.85 }}>
          <ShieldCheck size={13} className="banner-icon" />
          <span>Diperkuat Google Gemini AI & Referensi Hukum Ketenagakerjaan PT GSD</span>
        </div>
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
