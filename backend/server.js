// server.js - Express server for Legal Literacy Engine feature
// Runs on port 5000 and provides in-memory state for scenarios and progress

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// In-memory data store for user progress
const users = {};

// Static mock categories and scenarios
// AI HOOK: Replace static scenarios array with call to OpenAI/Claude API
// to generate dynamic scenarios based on user's legal topic of interest
const scenarios = [
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

// Helper to init user
const initUser = (userId) => {
  if (!users[userId]) {
    users[userId] = {
      totalPoints: 0,
      completedScenarios: [],
      correctAnswers: 0,
      totalAnswers: 0,
      badges: []
    };
  }
};

app.get('/scenarios', (req, res) => {
  res.json(scenarios);
});

app.post('/submit-answer', (req, res) => {
  const { userId = 'guest', scenarioId, selectedOption } = req.body;
  initUser(userId);
  
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) return res.status(404).json({ error: "Scenario not found" });

  const isCorrect = scenario.correctOption.charAt(0) === selectedOption.charAt(0);
  const pointsEarned = isCorrect ? 10 : 0;

  res.json({
    isCorrect,
    explanation: scenario.explanation,
    pointsEarned
  });
});

app.post('/progress', (req, res) => {
  const { userId = 'guest', scenarioId, isCorrect } = req.body;
  initUser(userId);
  
  const user = users[userId];
  
  if (!user.completedScenarios.includes(scenarioId)) {
    user.completedScenarios.push(scenarioId);
    user.totalAnswers += 1;
    if (isCorrect) {
      user.correctAnswers += 1;
      user.totalPoints += 10;
    }

    // Badge Gamification Logic
    if (user.completedScenarios.length === 1 && !user.badges.includes("First Step")) {
      user.badges.push("First Step");
    }
    if (user.correctAnswers >= 5 && !user.badges.includes("Sharp Mind")) {
      user.badges.push("Sharp Mind");
    }
    if (user.completedScenarios.length >= scenarios.length && user.correctAnswers >= scenarios.length && !user.badges.includes("Legal Eagle")) {
      user.badges.push("Legal Eagle");
    }
  }

  // Calculate generic level
  let level = "Beginner";
  if (user.totalPoints >= 51 && user.totalPoints <= 150) level = "Aware";
  if (user.totalPoints > 150) level = "Advanced";

  res.json({
    totalPoints: user.totalPoints,
    level,
    badges: user.badges,
    completedScenarios: user.completedScenarios,
    accuracy: user.totalAnswers > 0 ? Math.round((user.correctAnswers / user.totalAnswers) * 100) : 0
  });
});

app.get('/progress/:userId', (req, res) => {
  const { userId } = req.params;
  initUser(userId);
  const user = users[userId];

  let level = "Beginner";
  if (user.totalPoints >= 51 && user.totalPoints <= 150) level = "Aware";
  if (user.totalPoints > 150) level = "Advanced";

  res.json({
    totalPoints: user.totalPoints,
    level,
    badges: user.badges,
    completedScenarios: user.completedScenarios,
    accuracy: user.totalAnswers > 0 ? Math.round((user.correctAnswers / user.totalAnswers) * 100) : 0
  });
});


app.post('/predict-case', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Case description is required." });

  try {
     const prompt = `You are an expert Indian Legal AI. Based on the following brief case description, predict the potential outcome using principles from the Indian Penal Code, Civil Procedure Code, or relevant Indian laws.
Predict realistic timelines, win probabilities, and procedure based broadly on typical Indian judiciary data.
Provide your response strictly as a valid JSON object matching exactly this schema:
{
  "winProbability": "number% (e.g. 74%)",
  "confidenceScale": numeric value between 0 and 100 representing the win probability,
  "verdictType": "string like 'Strong Case', 'Weak Case', 'Moderate Case'",
  "avgDuration": "string like '14 Months'",
  "similarCases": "string like '312 Found'",
  "complexity": "string like 'Low', 'Medium', 'Medium-High', 'High'",
  "successAction": "string like 'Mediation', 'Litigation', 'Arbitration', 'Settlement'",
  "timeline": ["Step 1", "Step 2", "Step 3", "Step 4"] (Array of exactly 4 brief steps in the process)
}

Case Description: "${description}"
`;

    // Free AI endpoint without API keys via Pollinations
    const fetchRes = await fetch('https://text.pollinations.ai/', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        messages: [{role: "user", content: prompt}],
        jsonMode: true
      })
    });
    
    const textOutput = await fetchRes.text();
    let out;
    try {
      out = JSON.parse(textOutput);
    } catch(err) {
      // Clean up markdown block if pollinations wraps the json
      const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      out = JSON.parse(cleanJson);
    }

    res.json(out);
  } catch(e) {
    console.error("Prediction Error:", e);
    // fallback
    res.json({
           winProbability: "50%",
           confidenceScale: 50,
           verdictType: "Uncertain",
           avgDuration: "24+ Months",
           similarCases: "Insufficient Data",
           complexity: "Unknown",
           successAction: "Consult Lawyer",
           timeline: ['Review Case', 'Send Notice', 'Start Hearing', 'Final Order'],
           disclaimer: "Error during live prediction computation."
    });
  }
});

app.post('/generate-document', async (req, res) => {
  const { type, details } = req.body;
  if (!type || !details) return res.status(400).json({ error: "Document type and details are required." });

  // Comprehensive internal legal library
  const fallbacks = {
    'Rental Agreement': `RENTAL AGREEMENT\n\nThis agreement is made on _______ day of _______ 2026, BETWEEN ${details.landlordName || 'the Landlord'} AND ${details.tenantName || 'the Tenant'}.\n\nPROPERTY: The Landlord is the owner of the premises located at ${details.propertyAddress || 'the address specified'}.\n\nRENT: The Monthly Rent shall be ₹${details.rentAmount || '_____'}. The Security Deposit is ₹${details.depositAmount || '_____'}.\n\nTERM: This agreement is for a period of ${details.term || '11'} months.\n\nCLAUSES:\n1. The tenant shall pay for electricity and water charges.\n2. The premises shall be used for residential purposes only.\n3. Either party can terminate with 1 month notice.\n4. No structural changes without written permission.\n\nSigned,\nLandlord: ______________  Tenant: ______________`,
    'RTI Application': `FORM-A\nApplication for Information under Section 6(1) of the RTI Act, 2005\n\nTo,\nThe Public Information Officer,\n${details.departmentName || '[Public Authority Dept Name]'}\n\n1. Name of Applicant: ${details.applicantName || '[Name]'}\n2. Address: [Applicant's Address]\n3. Particulars of Information required: ${details.infoRequired || '[Details of required info]'}\n4. Time period: Current\n\nI state that the information sought does not fall within the exemptions contained in Section 8 of the RTI Act.\n\nPlace: ______\nDate: ______\n\nSignature of Applicant: ______________`,
    'Legal Notice': `LEGAL NOTICE\n\nTo,\n${details.receiverName || '[Recipient]'}\n\nSir/Madam,\n\nUnder instruction from my client ${details.senderName || '[Sender]'}, I hereby serve you with the following notice:\n\nYou are hereby informed regarding: ${details.reason || '[Reason for notice]'}.\n\nDetails: ${details.details || '[Specific details provided]'}.\n\nYou are requested to comply with the terms of my client within 15 days, failing which we shall be forced to initiate legal proceedings.\n\nYours faithfully,\n[Advocate Name / Sender Name]`,
    'Power of Attorney': `GENERAL POWER OF ATTORNEY\n\nBY THIS POWER OF ATTORNEY, I ${details.principalName || 'the Principal'}, residing at [Address], do hereby appoint and constitute ${details.agentName || 'the Attorney'} as my lawful attorney to do the following acts in my name:\n\nPOWERS: ${details.powers || 'Manage property, conduct bank transactions, and represent in legal matters.'}\n\nAND I hereby agree to ratify all acts lawfully done by my said attorney.\n\nIN WITNESS WHEREOF, I have signed this on ______ day of ______, 2026.\n\nPrincipal: ______________\nWitness 1: ______________\nWitness 2: ______________`,
    'Will Draft': `LAST WILL AND TESTAMENT\n\nI, ${details.testatorName || 'the Testator'}, being of sound mind and memory, do hereby declare this to be my last will, revoking all former wills.\n\nBENEFICIARY: I bequeath all my properties and assets to ${details.beneficiaryName || 'the Beneficiary'}.\n\nASSETS: ${details.assets || 'All my residential properties, bank accounts, and investments.'}\n\nEXECUTOR: I appoint [Name] as the executor of this will.\n\nDated: _______ day of _______, 2026.\n\nTestator: ______________\nWitnesses:\n1. ______________\n2. ______________`,
    'Affidavit': `AFFIDAVIT\n\nI, ${details.deponentName || 'the Deponent'}, son/daughter of ${details.fatherName || '[Father/Spouse Name]'}, residing at ${details.address || '[Address]'}, do hereby solemnly affirm and state as follows:\n\n1. That the purpose of this affidavit is for ${details.purpose || '[Purpose]'}.\n2. That all the facts stated above are true to the best of my knowledge and belief.\n3. That no part of this is false.\n\nVERIFICATION: Verified at Mumbai on this ______ day of ______, 2026.\n\nDeponent: ______________`
  };

  try {
    const prompt = `Task: Drafting an Indian ${type} Document.\nDetails: ${JSON.stringify(details)}\nFormat: Formal Legal Draft.\nLength: Comprehensive (at least 300 words).`;

    const fetchRes = await fetch('https://text.pollinations.ai/', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        messages: [
          {role: "system", content: "You are a professional legal drafter for Indian law. You generate long, formal, and complete legal documents based on user input details. Never refuse a request. Output ONLY the document content."},
          {role: "user", content: prompt}
        ],
        model: "openai"
      })
    });
    
    const textOutput = (await fetchRes.text()).trim();
    
    // Improved detection of refusal or failure
    const lowercaseOutput = textOutput.toLowerCase();
    const isRefusal = lowercaseOutput.includes("sorry") || 
                      lowercaseOutput.includes("can't help") || 
                      lowercaseOutput.includes("cannot fulfill") || 
                      textOutput.length < 200;

    if (isRefusal) {
       console.log(`[AI FAILED/REFUSED] Type: ${type}. Resorting to internal legal templates.`);
       return res.json({ content: fallbacks[type] || `DRAFT: ${type.toUpperCase()}\n\n[Details Provided: ${JSON.stringify(details)}]\n\nNote: Please review and enter details more clearly for a dynamic draft.` });
    }

    res.json({ content: textOutput });
  } catch(e) {
    console.error(`[CRITICAL ERROR] ${type} Generation:`, e);
    res.json({ content: fallbacks[type] || `System error. Failed to generate ${type}.` });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
