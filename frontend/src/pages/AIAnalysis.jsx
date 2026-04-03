import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, Copy, Check } from 'lucide-react';
import { chatWithAI } from '../services/api';

const user = JSON.parse(localStorage.getItem('aura_user') || '{}');
const isAdmin = user?.isAdmin;

const ADMIN_PROMPTS = [
    'Summarize today\'s complaint trends',
    'Which category has the highest volume?',
    'How many high-priority issues are unresolved?',
    'What is our current resolution rate?',
    'Give me insights on customer sentiment',
    'Which complaints need immediate attention?',
];
const CUSTOMER_PROMPTS = [
    'What is the status of my complaints?',
    'How long does it usually take to resolve?',
    'What happens after I submit a complaint?',
    'How do I escalate an urgent issue?',
    'Explain the priority levels to me',
    'What categories can I report issues under?',
];

const SUGGESTED = isAdmin ? ADMIN_PROMPTS : CUSTOMER_PROMPTS;

const WELCOME = isAdmin
    ? 'Ask me anything about complaint trends, resolution rates, customer sentiment, or specific issues. I have live access to your system data.'
    : 'Ask me about your complaints, how the process works, what to expect, or how to get faster help. I\'m here to assist you.';

function TypingDots() {
    return (
        <div className="flex items-center space-x-1 px-1 py-1">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-aura-light"
                    style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
            ))}
            <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
        </div>
    );
}

function MessageBubble({ msg }) {
    const [copied, setCopied] = useState(false);
    const isUser = msg.role === 'user';

    const copy = () => {
        navigator.clipboard.writeText(msg.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Format markdown-like text: **bold**, bullet points, numbered lists
    const formatText = (text) => {
        const lines = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .split('\n');

        const result = [];
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];
            if (line.match(/^[-•]\s/)) {
                // Collect consecutive bullet lines into a <ul>
                let items = '';
                while (i < lines.length && lines[i].match(/^[-•]\s/)) {
                    items += `<li style="margin-left:1.25rem;list-style-type:disc;margin-bottom:2px">${lines[i].slice(2)}</li>`;
                    i++;
                }
                result.push(`<ul style="margin-bottom:6px">${items}</ul>`);
                continue;
            } else if (line.match(/^\d+\.\s/)) {
                // Collect consecutive numbered lines into an <ol>
                let items = '';
                while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
                    items += `<li style="margin-left:1.25rem;margin-bottom:2px">${lines[i].replace(/^\d+\.\s/, '')}</li>`;
                    i++;
                }
                result.push(`<ol style="margin-bottom:6px;list-style-type:decimal">${items}</ol>`);
                continue;
            } else if (line.trim() === '') {
                result.push('<br/>');
            } else {
                result.push(`<p style="margin-bottom:4px">${line}</p>`);
            }
            i++;
        }
        return result.join('');
    };

    return (
        <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${isUser ? 'bg-gradient-to-br from-aura-dark to-aura-light' : 'bg-gradient-to-br from-aura-light to-aura-glow'}`}
                style={{ boxShadow: isUser ? '0 2px 8px rgba(30,27,75,0.25)' : '0 2px 8px rgba(99,102,241,0.3)' }}>
                {isUser
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Bot  className="w-3.5 h-3.5 text-white" />
                }
            </div>

            {/* Bubble */}
            <div className={`group max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative ${
                        isUser
                            ? 'text-white rounded-br-md'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-bl-md border border-gray-100 dark:border-slate-700 shadow-sm'
                    }`}
                    style={isUser ? { background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)' } : {}}
                >
                    {isUser
                        ? <p>{msg.content}</p>
                        : <div dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
                    }
                </div>

                {/* Copy button for AI messages */}
                {!isUser && (
                    <button
                        onClick={copy}
                        className="mt-1 ml-1 flex items-center space-x-1 text-[10px] text-gray-400 hover:text-aura-light opacity-0 group-hover:opacity-100 transition-all"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                )}

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}

const AIAnalysis = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput]       = useState('');
    const [loading, setLoading]   = useState(false);
    const bottomRef               = useRef(null);
    const inputRef                = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const content = (text || input).trim();
        if (!content || loading) return;

        const userMsg = { role: 'user', content, time: Date.now() };
        // Capture current messages BEFORE adding the new user message
        const historySnapshot = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
        }));

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('aura_token');
            const data  = await chatWithAI(content, historySnapshot, token);
            setMessages(prev => [...prev, { role: 'ai', content: data.reply, time: Date.now() }]);
        } catch (err) {
            const errMsg = err?.response?.data?.message || err?.message || 'Unknown error';
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Error: ${errMsg}`,
                time: Date.now()
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const clearChat = () => setMessages([]);

    return (
        <div className="flex flex-col h-[calc(100vh-68px-4rem)] animate-slide-up">

            {/* ── Header ──────────────────────────────── */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-aura-dark dark:text-white">AURA AI Assistant</h1>
                            <p className="text-gray-400 text-xs font-medium">Powered by Google Gemini · Live system access</p>
                        </div>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="flex items-center space-x-1.5 px-3 py-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            {/* ── Chat Area ───────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0 gap-5 lg:flex-row">

                {/* Messages */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 overflow-hidden">

                    {/* Scrollable messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        {messages.length === 0 ? (
                            /* Welcome state */
                            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
                                <div
                                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}
                                >
                                    <Sparkles className="w-9 h-9 text-white" />
                                </div>
                                <h2 className="text-xl font-black text-aura-dark dark:text-white mb-2">
                                    Hello, {user?.name?.split(' ')[0] || 'there'}!
                                </h2>
                                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">{WELCOME}</p>
                                <div className="mt-6 flex items-center space-x-2 text-xs text-aura-light font-semibold">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>Live data connected</span>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
                        )}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex items-end gap-2.5 animate-slide-up">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input bar */}
                    <div className="p-4 border-t border-gray-100 dark:border-slate-700">
                        <form
                            onSubmit={e => { e.preventDefault(); sendMessage(); }}
                            className="flex items-center space-x-3"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask anything about your complaints..."
                                className="flex-1 px-4 py-3 bg-aura-bg dark:bg-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-aura-light/25 transition-all dark:text-gray-200 dark:placeholder-gray-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-3 rounded-xl text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #1e1b4b, #6366f1)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Suggested prompts sidebar */}
                <div className="lg:w-64 flex-shrink-0 space-y-3">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 p-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="w-4 h-4 text-aura-light" />
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggested Prompts</p>
                        </div>
                        <div className="space-y-2">
                            {SUGGESTED.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(prompt)}
                                    disabled={loading}
                                    className="w-full text-left text-xs p-3 bg-aura-bg dark:bg-slate-700/60 hover:bg-aura-light/10 dark:hover:bg-aura-light/10 hover:text-aura-light rounded-xl transition-all text-gray-600 dark:text-gray-400 font-medium leading-relaxed disabled:opacity-40"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info card */}
                    <div
                        className="rounded-2xl p-4 text-white relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 100%)' }}
                    >
                        <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" />
                        <div className="relative z-10">
                            <Bot className="w-6 h-6 text-aura-glow mb-2" />
                            <p className="text-white font-bold text-sm mb-1">Context-Aware AI</p>
                            <p className="text-white/50 text-xs leading-relaxed">
                                AURA AI reads your live dashboard data before every response, so answers are always based on real numbers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysis;
