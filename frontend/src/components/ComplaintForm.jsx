import React, { useState, useEffect } from 'react';
import { Mic, Send, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { createComplaint } from '../services/api';

const ComplaintForm = ({ onSuccess }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Web Speech API for Voice Input
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Speech recognition not supported");
        }
    }, []);

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(prev => (prev ? `${prev} ${transcript}` : transcript));
        };
        recognition.onerror = (err) => {
            console.error(err);
            setIsListening(false);
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
            const data = await createComplaint({ text });
            setResult(data);
            setText('');
            if (onSuccess) onSuccess(data);
        } catch (err) {
            setError('Failed to submit complaint. Please check your backend connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-aura-dark">Submit New Complaint</h3>
                <div className="flex items-center text-xs text-gray-400">
                    <Info className="w-3 h-3 mr-1" />
                    AI will analyze your message automatically
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="relative">
                    <textarea 
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-aura-light/10 focus:bg-white transition-all outline-none resize-none text-sm"
                        placeholder="Describe your issue in detail..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-aura-light/10 text-aura-light hover:bg-aura-light hover:text-white'}`}
                        title="Voice Input"
                    >
                        <Mic className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-aura-dark text-white rounded-xl font-medium hover:bg-aura-light hover:shadow-lg hover:shadow-aura-light/25 disabled:opacity-50 disabled:shadow-none transition-all"
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
                <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {result && (
                <div className="m-6 p-6 bg-green-50 border border-green-100 rounded-2xl animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center text-green-700 font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        AI Analysis Complete
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-3 rounded-xl border border-green-200">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Category</p>
                            <p className="text-sm font-semibold text-aura-dark">{result.category}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-green-200">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Sentiment</p>
                            <p className="text-sm font-semibold text-aura-dark">{result.sentiment}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-green-200">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Priority</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${result.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                {result.priority}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-xl border border-green-200">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Suggested System Response</p>
                        <p className="text-sm text-gray-600 italic">"{result.response}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintForm;
