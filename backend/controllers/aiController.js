const { GoogleGenerativeAI } = require('@google/generative-ai');
const Complaint = require('../models/Complaint');

// @desc    Multi-turn AI chat with persistent context and conversation memory
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        // ── Build live context from DB ──────────────────────────────
        let contextInfo = '';

        if (req.user.isAdmin) {
            const [total, pending, resolved, byCategory, bySentiment, recentComplaints, highPriority] = await Promise.all([
                Complaint.countDocuments({}),
                Complaint.countDocuments({ status: 'pending' }),
                Complaint.countDocuments({ status: 'resolved' }),
                Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
                Complaint.aggregate([{ $group: { _id: '$sentiment',  count: { $sum: 1 } } }]),
                Complaint.find({}).sort({ createdAt: -1 }).limit(8).populate('user', 'name'),
                Complaint.countDocuments({ priority: 'High', status: 'pending' }),
            ]);
            const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

            contextInfo = `
## Live Admin Dashboard — fetched now from MongoDB
- Total complaints: ${total}
- Pending: ${pending} | Resolved: ${resolved} | Resolution rate: ${resolutionRate}%
- High-priority pending (urgent): ${highPriority}
- By category: ${byCategory.map(c => `${c._id} × ${c.count}`).join(' | ')}
- By sentiment: ${bySentiment.map(s => `${s._id} × ${s.count}`).join(' | ')}
- 8 most recent complaints:
${recentComplaints.map((c, i) =>
    `  ${i + 1}. "${c.text.slice(0, 80)}${c.text.length > 80 ? '…' : ''}" — cat:${c.category}, priority:${c.priority}, status:${c.status}, by:${c.user?.name || 'unknown'}`
).join('\n')}`;
        } else {
            const myComplaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
            const pending  = myComplaints.filter(c => c.status === 'pending').length;
            const resolved = myComplaints.filter(c => c.status === 'resolved').length;
            const highPri  = myComplaints.filter(c => c.priority === 'High').length;

            contextInfo = `
## Live Customer Data for "${req.user.name}" (${req.user.email})
- Total complaints submitted: ${myComplaints.length}
- Pending: ${pending} | Resolved: ${resolved} | High-priority: ${highPri}
- Their complaints:
${myComplaints.slice(0, 6).map((c, i) =>
    `  ${i + 1}. "${c.text.slice(0, 80)}${c.text.length > 80 ? '…' : ''}" — cat:${c.category}, priority:${c.priority}, status:${c.status}, ${new Date(c.createdAt).toLocaleDateString()}`
).join('\n')}`;
        }

        // ── Initialise Gemini with system instruction ───────────────
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: `You are AURA AI — an expert, professional, and friendly banking complaint management assistant embedded in the AURA AI platform.

Your role:
- Help ${req.user.isAdmin ? 'bank administrators' : 'banking customers'} understand and manage complaint data.
- Provide accurate, data-driven insights when asked about trends, statistics, or specific issues.
- Be conversational but professional. Adapt your tone to the question.
- Use markdown formatting (bold, bullet lists, numbered lists) to make answers clear and scannable.
- Never say you are Gemini or built by Google. You are AURA AI.
- If asked something unrelated to banking or complaints, gently redirect to your purpose.
- When referencing numbers, always pull from the live data provided in the conversation.`,
            generationConfig: {
                temperature:     0.7,
                topP:            0.9,
                topK:            40,
                maxOutputTokens: 1024,
            },
        });

        // ── Build full Gemini history ───────────────────────────────
        // Slot 0: context priming pair (always injected so context survives across turns)
        const geminiHistory = [
            {
                role:  'user',
                parts: [{ text: `SESSION CONTEXT (live data from the system — use this throughout our conversation):\n${contextInfo}` }],
            },
            {
                role:  'model',
                parts: [{ text: `Understood. I have your live system data loaded. I'm ready to assist you, ${req.user.name}. What would you like to know?` }],
            },
        ];

        // Append prior conversation turns from the frontend
        for (const turn of history) {
            geminiHistory.push({
                role:  turn.role === 'user' ? 'user' : 'model',
                parts: [{ text: turn.content }],
            });
        }

        // ── Send the new message ────────────────────────────────────
        const chat   = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        const reply  = result.response.text();

        res.json({ reply });

    } catch (error) {
        console.error('AI Chat Error:', error?.message || error);
        res.status(500).json({
            message: `AI error: ${error?.message || 'Unknown error. Check server logs.'}`,
        });
    }
};

module.exports = { chatWithAI };
