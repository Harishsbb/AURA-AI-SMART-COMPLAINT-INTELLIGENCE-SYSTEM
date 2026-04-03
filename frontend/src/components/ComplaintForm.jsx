import React, { useState, useEffect } from 'react';
import { Mic, Send, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { createComplaint } from '../services/api';

const MAX_CHARS = 500;

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'High': return 'bg-red-50 text-red-600 border border-red-200';
        case 'Medium': return 'bg-orange-50 text-orange-600 border border-orange-200';
        case 'Low': return 'bg-blue-50 text-blue-600 border border-blue-200';
        default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
};

const ComplaintForm = ({ onSuccess }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser");
        }
    }, []);

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Voice input is not supported in your browser.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(prev => {
                const updated = prev ? `${prev} ${transcript}` : transcript;
                return updated.slice(0, MAX_CHARS);
            });
        };
        recognition.onerror = (err) => {
            console.error(err);
            setIsListening(false);
            setError('Voice input failed. Please try again.');
        };
        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('aura_token');
            const data = await createComplaint({ text }, token);
            setResult(data);
            setText('');
            if (onSuccess) onSuccess(data);
        } catch (err) {
            setError('Failed to submit. Please check your connection and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const charCount = text.length;
    const isNearLimit = charCount > MAX_CHARS * 0.85;
    const isAtLimit = charCount >= MAX_CHARS;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/30">
                <h3 className="font-bold text-aura-dark dark:text-white">Submit New Complaint</h3>
                <div className="flex items-center text-xs text-gray-400">
                    <Info className="w-3 h-3 mr-1" />
                    AI will analyze your message
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="relative">
                    <textarea
                        className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-aura-light/20 focus:bg-white dark:focus:bg-slate-600 transition-all outline-none resize-none text-sm dark:text-gray-200 dark:placeholder-gray-400"
                        placeholder="Describe your issue in detail..."
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                        required
                    />
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-aura-light/10 text-aura-light hover:bg-aura-light hover:text-white'}`}
                        title={isListening ? 'Listening...' : 'Voice Input'}
                    >
                        <Mic className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium transition-colors ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-400' : 'text-gray-400'}`}>
                        {charCount}/{MAX_CHARS} characters
                    </span>
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-aura-dark dark:bg-aura-light text-white rounded-xl font-medium hover:bg-aura-light hover:shadow-lg hover:shadow-aura-light/25 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>Analyze & Submit</span>
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-500/20">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {result && (
                <div className="mx-6 mb-6 p-6 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center text-green-700 dark:text-green-400 font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        AI Analysis Complete
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-green-200 dark:border-green-500/20">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Category</p>
                            <p className="text-sm font-semibold text-aura-dark dark:text-white">{result.category}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-green-200 dark:border-green-500/20">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Sentiment</p>
                            <p className="text-sm font-semibold text-aura-dark dark:text-white">{result.sentiment}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-green-200 dark:border-green-500/20">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Priority</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPriorityStyle(result.priority)}`}>
                                {result.priority}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-700/50 p-4 rounded-xl border border-green-200 dark:border-green-500/20">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">AI Suggested Response</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{result.response}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintForm;
