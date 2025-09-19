# 🎉 Julia's Birthday Chatbot Website

A special birthday website for Julia with an AI chatbot to help her choose her stand-up comedy show gift!

## ✨ Features

- 🎂 Beautiful birthday-themed responsive design
- 🤖 AI chatbot powered by GPT-4 with custom French prompt
- 💬 Real-time conversation interface
- 📝 Automatic conversation logging to Google Docs
- 🎨 Animated birthday decorations and festive colors
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 18.18 or later
- npm or yarn package manager
- OpenAI API key
- Google Cloud Platform account (for Google Docs integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd julia-birthday-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the `.env.local` file and fill in your API keys and configuration:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Docs API Configuration
GOOGLE_PROJECT_ID=your_google_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_DOCS_ID=your_google_docs_document_id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment on Vercel

### Step 1: Prepare for Deployment

1. Build the project locally to ensure everything works:
```bash
npm run build
```

2. Make sure all environment variables are configured correctly.

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your project.

4. Add environment variables in Vercel dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add all the variables from your `.env.local` file

#### Option B: GitHub Integration

1. Push your code to a GitHub repository
2. Connect your GitHub repo to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Step 3: Configure Google Docs Integration (SIMPLE METHOD!)

Since you have a shared Google Doc, no API keys needed! Just use Google Apps Script:

1. **Create a Google Apps Script**:
   - Go to [script.google.com](https://script.google.com/)
   - Create a new project
   - Replace the default code with this:

```javascript
function doPost(e) {
  try {
    // Your Google Doc ID from the URL
    const DOCUMENT_ID = '103ayF4qnGwHzN9bCY4KFvILEJP2KFF397JsSkyavnxQ';

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const { timestamp, userMessage, botResponse } = data;

    // Open the document
    const doc = DocumentApp.openById(DOCUMENT_ID);
    const body = doc.getBody();

    // Format the conversation entry
    const entry = `\n=== ${timestamp} ===\n👤 Julia: ${userMessage}\n🤖 Assistant: ${botResponse}\n\n`;

    // Append to the document
    body.appendParagraph(entry);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

2. **Deploy the Script**:
   - Click "Deploy" > "New deployment"
   - Choose type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the web app URL

3. **Add the URL to your environment**:
   - Paste the web app URL in `.env.local` as `GOOGLE_APPS_SCRIPT_URL`

That's it! No API keys, no service accounts - just works! 🎉

## 🎯 The Chatbot Experience

The chatbot uses a custom French prompt that:
- Explains that Julia's friends want to give her a stand-up show for her birthday
- Presents three amazing show options:
  - Ana Godefroy in Aix on Friday, May 29th at 9:30 PM
  - Verino in Marseille on Thursday, March 19th at 8:00 PM
  - Salima Passion in Marseille (date TBD)
- Uses a fun, enthusiastic tone
- Helps her make the perfect choice for her birthday gift

## 📋 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Logging**: Google Docs API
- **Deployment**: Vercel

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── api/chat/          # API route for chatbot
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage with chatbot
└── lib/
    └── google-docs.ts    # Google Docs integration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Features

- Animated birthday emojis floating on screen
- Gradient backgrounds with pink, purple, and yellow
- Glassmorphism effect on chat interface
- Responsive design for all devices
- Smooth hover animations and transitions
- French localization throughout

## 🎁 Happy Birthday Julia!

This website was made with love for Julia's special day. May she have an amazing time at whichever stand-up show she chooses! 🎉👑
