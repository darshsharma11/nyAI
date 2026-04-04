// server.js - Express server for Legal Literacy Engine feature
// Runs on port 5000 and provides in-memory state for scenarios and progress

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ─── AI PROVIDER CONFIG ───
const getProviders = () => ({
  OPENROUTER: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "meta-llama/llama-3.3-70b-instruct:free",
    key: process.env.OPENROUTER_API_KEY
  },
  GEMINI: {
    url: "https://generativelanguage.googleapis.com/v1beta/models",
    model: "gemini-2.0-flash",
    key: process.env.GEMINI_API_KEY
  },
  OLLAMA: {
    url: "https://ollama.com/v1/chat/completions",
    model: "ministral-3:8b",
    key: process.env.OLLAMA_API_KEY
  },
  ANTHROPIC: {
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-3-haiku-20240307",
    key: process.env.ANTHROPIC_API_KEY
  },
  OPENAI: {
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    key: process.env.OPENAI_API_KEY
  }
});

// ─── MONGODB CONNECTION ───
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nyai';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB via Mongoose'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ─── AUTHENTICATION ROUTES ───
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nyAI_super_secret_dev_key', {
    expiresIn: '30d',
  });
};

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists with that email" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Static mock categories and scenarios
let scenarios = [
  {
    id: 1,
    category: "Consumer Rights",
    situation: "You ordered a smartphone online, but received a box containing a bar of soap. The seller refuses to issue a refund, claiming you received the correct item.",
    question: "What is your best immediate legal recourse?",
    options: [
      "A. Accept the loss as terms were agreed.",
      "B. File a complaint on the National Consumer Helpline.",
      "C. Directly sue the delivery boy.",
      "D. Post strongly worded comments on their social media."
    ],
    correctOption: "B",
    explanation: "Under the Consumer Protection Act, consumers have the right to seek redressal against unfair trade practices. The National Consumer Helpline provides immediate mediation and formal grievance filing support.",
    difficulty: "beginner"
  },
  {
    id: 2,
    category: "Workplace Rights",
    situation: "You have resigned from your company serving full notice period. Your employer is now withholding your final month's salary and full & final settlement without giving any formal reason.",
    question: "What is the correct formal step to take first?",
    options: [
      "A. Send a formal legal notice demanding payment under the Payment of Wages Act.",
      "B. Steal company property equivalent to the salary amount.",
      "C. Threaten the HR manager on WhatsApp.",
      "D. Wait indefinitely for the company's grace."
    ],
    correctOption: "A",
    explanation: "Withholding wages after normal exits is illegal. A formal legal notice gives the employer a timeline to clear dues, failing which you can approach the Labour Commissioner under the Payment of Wages Act.",
    difficulty: "intermediate"
  },
  {
    id: 3,
    category: "Tenant Rights",
    situation: "Your landlord suddenly tells you to vacate the apartment within 2 days, changing the locks while you were out, even though you have a valid 11-month rent agreement and no payment defaults.",
    question: "Is the landlord's action legal?",
    options: [
      "A. Yes, since it's their property, they can do as they please.",
      "B. No, illegal eviction without a court order or proper notice is a criminal offense.",
      "C. Yes, if they reimburse your deposit immediately.",
      "D. Only if their relatives need the house urgently."
    ],
    correctOption: "B",
    explanation: "Even owners cannot evict tenants arbitrarily without due process. Changing locks and illegal eviction is punishable. You can file an FIR for trespass and illegal eviction.",
    difficulty: "intermediate"
  },
  {
    id: 4,
    category: "Right to Information",
    situation: "You noticed the road in your colony was built only last month but has completely broken down. You want to know the contractor's details and the budget allocated.",
    question: "How can you formally acquire this information?",
    options: [
      "A. Ask the local politician during a rally.",
      "B. Bribe a municipal clerk for the files.",
      "C. File an RTI (Right to Information) application.",
      "D. Guess the amount and complain in a newspaper."
    ],
    correctOption: "C",
    explanation: "The RTI Act empowers citizens to request data from public authorities. You can formally file an RTI application online or offline to retrieve copies of contracts and budgets.",
    difficulty: "beginner"
  }
];

// Removed static initialization (initUser) for progress logic
// ─── SMART AI DISPATCHER ───

async function callOllama(prompt, maxTokens, config) {
  const resp = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.key}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      stream: false
    })
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`Ollama Response Error (${resp.status}):`, errorText);
    throw new Error(`Ollama Error: ${errorText}`);
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}

async function callAnthropic(prompt, maxTokens, config) {
  const resp = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`Anthropic Response Error (${resp.status}):`, errorText);
    throw new Error(`Anthropic Error: ${errorText}`);
  }
  const data = await resp.json();
  return data.content[0].text;
}

async function callOpenAI(prompt, maxTokens, config) {
  const resp = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.key}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens
    })
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`OpenAI Response Error (${resp.status}):`, errorText);
    throw new Error(`OpenAI Error: ${errorText}`);
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}

// ─── GEMINI CALLER ───

async function callGemini(prompt, maxTokens, config) {
  const url = `${config.url}/${config.model}:generateContent?key=${config.key}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens }
    })
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`Gemini Response Error (${resp.status}):`, errorText);
    throw new Error(`Gemini Error: ${errorText}`);
  }
  const data = await resp.json();
  return data.candidates[0].content.parts[0].text;
}

// ─── OPENROUTER CALLER (OpenAI-compatible) ───

async function callOpenRouter(prompt, maxTokens, config) {
  const resp = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.key}`,
      "HTTP-Referer": "https://nyai.legal",
      "X-Title": "nyAI Legal Connect"
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens
    })
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`OpenRouter Response Error (${resp.status}):`, errorText);
    throw new Error(`OpenRouter Error: ${errorText}`);
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}

// ─── SMART AI DISPATCHER HELPER ───

async function handleAIRequest(prompt, maxTokens = 1000) {
  const PROVIDERS = getProviders();
  let result = null;
  let engine = "None";

  // 1. Try OpenRouter (Primary - Multi-model gateway)
  if (PROVIDERS.OPENROUTER.key) {
    try {
      result = await callOpenRouter(prompt, maxTokens, PROVIDERS.OPENROUTER);
      engine = `OpenRouter (${PROVIDERS.OPENROUTER.model})`;
      console.log(`✅ AI composed via ${engine}`);
    } catch (e) { console.warn("OpenRouter fallback triggered:", e.message); }
  }

  // 2. Try Gemini (Google AI Free)
  if (!result && PROVIDERS.GEMINI.key) {
    try {
      result = await callGemini(prompt, maxTokens, PROVIDERS.GEMINI);
      engine = "Google Gemini";
      console.log(`✅ AI composed via ${engine}`);
    } catch (e) { console.warn("Gemini fallback triggered:", e.message); }
  }

  // 3. Try Ollama
  if (!result && PROVIDERS.OLLAMA.key) {
    try {
      result = await callOllama(prompt, maxTokens, PROVIDERS.OLLAMA);
      engine = "Ollama Cloud";
    } catch (e) { console.warn("Ollama fallback triggered:", e.message); }
  }

  // 4. Try Anthropic
  if (!result && PROVIDERS.ANTHROPIC.key) {
    try {
      result = await callAnthropic(prompt, maxTokens, PROVIDERS.ANTHROPIC);
      engine = "Anthropic Claude";
    } catch (e) { console.warn("Anthropic fallback triggered:", e.message); }
  }

  // 5. Try OpenAI
  if (!result && PROVIDERS.OPENAI.key) {
    try {
      result = await callOpenAI(prompt, maxTokens, PROVIDERS.OPENAI);
      engine = "OpenAI GPT-4";
    } catch (e) { console.warn("Final fallback failed:", e.message); }
  }

  if (!result) throw new Error("No AI provider keys available or services down.");
  return { text: result, engine };
}

app.post('/ai/ask', async (req, res) => {
  const { prompt, maxTokens = 1000 } = req.body;
  try {
    const { text, engine } = await handleAIRequest(prompt, maxTokens);
    res.json({ content: [{ text }], engine });
  } catch (err) {
    console.error("Dispatcher Error:", err);
    res.status(500).json({ error: "Failed to communicate with AI engines." });
  }
});

app.post('/ai/generate-scenarios', async (req, res) => {
  const prompt = `Generate 3 unique legal scenarios for India. Return ONLY a valid JSON array. 
Fields: id (starting from ${scenarios.length + 1}), category, situation, question, options, correctOption, explanation, difficulty.`;

  try {
    const { text, engine } = await handleAIRequest(prompt, 2000);
    const cleaned = text.replace(/```json|```/g, "").trim();
    const newScenarios = JSON.parse(cleaned);
    scenarios = [...scenarios, ...newScenarios];
    res.json({ message: `Success. Created ${newScenarios.length} cases.`, engine, total: scenarios.length });
  } catch (err) {
    console.error("Generation Error:", err);
    res.status(500).json({ error: "Failed to generate or parse AI scenarios." });
  }
});

// ─── DATA ROUTES ───

app.get('/api/lawyers', async (req, res) => {
  const { lat, lng, radius = 50000, query = "lawyer" } = req.query;
  const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: "Missing VITE_GOOGLE_PLACES_API_KEY in .env" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radius}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Google Places REST Error:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.get('/scenarios', (req, res) => {
  res.json(scenarios);
});

app.post('/progress', async (req, res) => {
  const { userId, scenarioId, isCorrect } = req.body;
  try {
    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId);
    }
    
    // Fallback for guest
    if (!user) {
       return res.json({
          totalPoints: isCorrect ? 10 : 0, level: "Beginner", badges: ["Guest Mode"], completedScenarios: [scenarioId], accuracy: 100, totalCasesClosed: 1, activeEngine: "Guest"
       });
    }

    if (!user.completedScenarios.includes(scenarioId)) {
      user.completedScenarios.push(scenarioId);
      user.totalAnswers += 1;
      if (isCorrect) {
        user.correctAnswers += 1;
        user.totalPoints += 10;
      }
      if (user.completedScenarios.length === 1 && !user.badges.includes("First Step")) {
        user.badges.push("First Step");
      }
      if (user.correctAnswers >= 5 && !user.badges.includes("Sharp Mind")) {
        user.badges.push("Sharp Mind");
      }
      if (user.completedScenarios.length >= 10 && !user.badges.includes("Legal Eagle")) {
        user.badges.push("Legal Eagle");
      }
      await user.save();
    }

    let level = "Beginner";
    if (user.totalPoints >= 51 && user.totalPoints <= 150) level = "Aware";
    if (user.totalPoints > 150) level = "Advanced";

    const providers = getProviders();
    const engine = providers.OLLAMA.key ? "Ollama Cloud" : (providers.OPENAI.key ? "OpenAI" : "None");

    res.json({
      totalPoints: user.totalPoints,
      level,
      badges: user.badges,
      completedScenarios: user.completedScenarios,
      accuracy: user.totalAnswers > 0 ? Math.round((user.correctAnswers / user.totalAnswers) * 100) : 0,
      totalCasesClosed: user.completedScenarios.length,
      activeEngine: engine
    });
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

app.get('/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.json({
        totalPoints: 0, level: "Beginner", badges: [], completedScenarios: [], accuracy: 0, totalCasesClosed: 0, activeEngine: "Guest"
      });
    }

    let level = "Beginner";
    if (user.totalPoints >= 51 && user.totalPoints <= 150) level = "Aware";
    if (user.totalPoints > 150) level = "Advanced";

    const providers = getProviders();
    const engine = providers.OLLAMA.key ? "Ollama Cloud" : (providers.OPENAI.key ? "OpenAI" : "None");

    res.json({
      totalPoints: user.totalPoints,
      level,
      badges: user.badges,
      completedScenarios: user.completedScenarios,
      accuracy: user.totalAnswers > 0 ? Math.round((user.correctAnswers / user.totalAnswers) * 100) : 0,
      totalCasesClosed: user.completedScenarios.length,
      activeEngine: engine
    });
  } catch (err) {
    console.error("Fetch Progress Error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ─── EMAIL TRANSPORTER ───
const createEmailTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (!user || !pass) {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS not set in .env — email sending will fail.");
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

// ─── SEND LAWYER EMAIL ENDPOINT ───
app.post('/api/send-lawyer-email', async (req, res) => {
  const { clientInfo, answers, lawyer, category } = req.body;
  
  if (!clientInfo || !lawyer) {
    return res.status(400).json({ success: false, error: "Missing client or lawyer information." });
  }
  
  // Build the AI prompt to compose the email
  const answersText = Object.entries(answers || {})
    .map(([key, value]) => `- ${key.replace(/_/g, ' ').toUpperCase()}: ${value}`)
    .join('\n');
  
  const composePrompt = `You are a professional legal assistant for nyAI, an Indian legal-tech platform.
Compose a formal, professional email to a lawyer notifying them about a new client inquiry.

LAWYER DETAILS:
- Name: ${lawyer.name}
- Specialty: ${lawyer.specialty || category}
- City: ${lawyer.city || 'India'}

CLIENT DETAILS:
- Name: ${clientInfo.name}
- Phone: ${clientInfo.phone}
- Email: ${clientInfo.email}
- City: ${clientInfo.city}

CASE CATEGORY: ${category}

CASE DETAILS PROVIDED BY CLIENT:
${answersText}

INSTRUCTIONS:
1. Write a professional email body (not including subject line).
2. Address the lawyer formally (Dear ${lawyer.name}).
3. Introduce the client and their legal matter concisely.
4. Summarize the case details provided in a structured, easy-to-read format.
5. Include the client's contact information clearly.
6. End with a request for the advocate to reach out to the client at their earliest convenience.
7. Sign off as "nyAI Legal Connect Platform".
8. Keep the tone professional, respectful, and concise.
9. Do NOT add any HTML tags, just plain text.`;

  try {
    // Step 1: Compose the email using AI
    let emailBody;
    try {
      const { text } = await handleAIRequest(composePrompt, 1500);
      emailBody = text;
    } catch (aiError) {
      // Fallback: compose manually if AI fails
      console.warn("AI compose failed, using manual template:", aiError.message);
      emailBody = `Dear ${lawyer.name},

Greetings from nyAI Legal Connect Platform.

A new client has submitted a consultation request through our platform for your expertise in ${category}. Below are the details:

CLIENT INFORMATION:
• Name: ${clientInfo.name}
• Phone: ${clientInfo.phone}
• Email: ${clientInfo.email}
• City: ${clientInfo.city}

CASE DETAILS (${category}):
${answersText}

We kindly request you to review the above information and reach out to the client at your earliest convenience.

Thank you for being a trusted advocate on our platform.

Warm regards,
nyAI Legal Connect Platform
"Democratizing access to justice for every Indian citizen."`;
    }

    // Step 2: Send the email
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.log("─── EMAIL WOULD BE SENT (SMTP not configured) ───");
      console.log(`TO: ${lawyer.email}`);
      console.log(`SUBJECT: New Client Inquiry — ${category} | ${clientInfo.name} via nyAI`);
      console.log(`BODY:\n${emailBody}`);
      console.log("─── END EMAIL ───");
      
      return res.json({ 
        success: true, 
        message: "Email composed successfully (SMTP not configured — logged to console).",
        preview: emailBody
      });
    }

    const mailOptions = {
      from: `"${clientInfo.name} via nyAI" <${process.env.EMAIL_USER}>`,
      to: lawyer.email,
      replyTo: clientInfo.email,
      subject: `New Client Inquiry — ${category} | ${clientInfo.name} via nyAI`,
      text: emailBody
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${lawyer.email}: ${info.messageId}`);
    
    res.json({ 
      success: true, 
      message: `Email successfully sent to ${lawyer.name}.`,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to send email: ${error.message}` 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
