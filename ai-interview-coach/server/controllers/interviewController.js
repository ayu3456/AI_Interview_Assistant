const Session = require("../models/Session");
const { openai, getSystemPrompt } = require("../utils/openai");

const sendMessage = async (req, res) => {
  try {
    const { messages, role, company, difficulty, totalQuestions } = req.body;

    if (!Array.isArray(messages) || !role || !company || !difficulty) {
      return res.status(400).json({ message: "Missing interview details." });
    }

    const safeTotal = Number.isFinite(Number(totalQuestions))
      ? Number(totalQuestions)
      : 5;

    const systemPrompt = getSystemPrompt(role, company, difficulty, safeTotal);

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    });

    const reply = completion?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error.message || error);
    return res.status(500).json({ message: "Unable to get AI response." });
  }
};

const saveInterview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { role, company, difficulty, duration, mode, messages, feedback } =
      req.body;

    if (!role || !company || !difficulty || !duration || !messages || !feedback) {
      return res.status(400).json({ message: "Missing interview data." });
    }

    const session = await Session.create({
      userId,
      role,
      company,
      difficulty,
      duration,
      mode: mode || "Text Mode",
      messages,
      feedback,
    });

    return res.status(201).json({ session });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save session." });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load history." });
  }
};

const getSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const session = await Session.findOne({ _id: id, userId }).lean();
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    return res.status(200).json({ session });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load session." });
  }
};

module.exports = { sendMessage, saveInterview, getHistory, getSession };
