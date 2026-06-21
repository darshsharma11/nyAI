# nyAI - Democratizing Justice for Bharat ⚖️🤖

**nyAI** is a comprehensive, full-stack, multilingual platform designed to make legal help, awareness, and documentation accessible to every citizen in India. Using modern AI and gamified education, nyAI simplifies complex legal processes and bridges the gap between citizens and legal help.

---

## 🚀 Key Features

### 1. 🤖 AI Legal Chatbot & Tools
- **Conversational Assistance**: Query-solving chatbot with support for multiple AI engines (including Google Gemini, OpenAI, and Anthropic).
- **Multilingual Queries**: Ask questions and get answers in local Indian languages.

### 2. 📄 Document Analyzer & Generator
- **AI Document Parsing**: Upload PDFs or scan images (using built-in OCR) to analyze complex legal documents.
- **Automated Templates**: Instantly generate professional legal templates:
  - Rental Agreements
  - Non-Disclosure Agreements (NDAs)
  - Employment Contracts
  - Legal Notices
  - Income Tax Return (ITR) Replies
- **PDF Generation**: Export generated templates directly to PDFs.

### 3. 🎓 LexArena (Legal Literacy)
- **Interactive Modules**: Learn about key legal topics (Fundamental Rights, Consumer Protection, Labor Laws, etc.).
- **Scenario Quizzes**: Engage in realistic scenario-based quizzes to test legal knowledge.
- **Progress Tracking**: Keep tabs on your learning journey with a gamified dashboard.

### 4. 🗺️ Lawyer Connect & Dashboard
- **Find Lawyers**: Use an interactive map integration to locate and connect with lawyers nearby.
- **Lawyer Portal**: Dedicated dashboard for registered advocates to manage consultations, view patient case listings, and respond to inquiries.

### 5. 🚨 SOS Emergency Support
- **Immediate Help**: A one-click SOS button to connect instantly with available legal aid.
- **Helplines**: Access quick-dial shortcuts to standard Indian emergency lines (100, 181, etc.).

### 6. 🌐 Multilingual Support (i18n)
- Fully localized interface offering translation across 10 Indian languages:
  - English, Hindi (हिन्दी), Bengali (বাংলা), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), Tamil (தமிழ்), and Telugu (తెలుగు).

---

## 🛠️ Technology Stack

- **Frontend**: React (v19), Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router DOM, i18next.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT) for authentication.
- **APIs & Services**: Google Generative AI (Gemini), Google OAuth, Google Maps API, Nodemailer, Tesseract.js (OCR), pdf-parse.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/darshsharma11/nyAI.git
   cd nyAI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_uri
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```
4. Run the development server and backend:
   - **Frontend (Vite)**: `npm run dev`
   - **Backend Server**: `npm run server`

