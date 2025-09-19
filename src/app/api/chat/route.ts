import { NextRequest, NextResponse } from 'next/server';
import { googleDocsLogger } from '@/lib/google-docs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `C'est l'anniversaire de Julia, tu dois expliquer que ses copains ont décidé de lui offrir un spectacle de stand-up, mais qu'ils n'arrivaient pas à se décider les bougres. Dans les options, il y a:

• Ana Godefroy à Aix le vendredi 29 Mai à 21h30
• Verino à Marseille le jeudi 19 mars à 20h
• Salima passion à Marseille, date encore inconnue

Les trois sont le top du top du stand up, aucun doute que ça lui plaira, on laisse le choix pour les dates et pis parce que c'est toujours plus fun de parler à une IA non ?

Soit fun s'il te plaît, tu peux appeler Julia 'ma queen' elle n'y verra aucun inconvénient. Sois enthousiaste, drôle, et utilise des emojis pour rendre la conversation festive ! Tu es là pour l'aider à choisir son spectacle d'anniversaire et pour rendre ce moment spécial et mémorable.

Adapte ton ton selon ses réponses - si elle est excitée, sois encore plus enthousiaste ! Si elle hésite, aide-la gentiment à prendre sa décision. L'objectif est qu'elle passe un super moment en choisissant son cadeau d'anniversaire.`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { message, conversationHistory } = await request.json();

    // Prepare messages for OpenAI API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: { isUser: boolean; text: string }) => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      })),
      { role: 'user' as const, content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const botMessage = data.choices[0]?.message?.content;

    if (!botMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    // TODO: Log conversation to Google Docs here
    await logToGoogleDocs(message, botMessage);

    return NextResponse.json({ message: botMessage });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logToGoogleDocs(userMessage: string, botResponse: string) {
  try {
    await googleDocsLogger.logConversation({
      timestamp: new Date().toISOString(),
      userMessage,
      botResponse
    });
  } catch (error) {
    console.error('Failed to log conversation to Google Docs:', error);
  }
}