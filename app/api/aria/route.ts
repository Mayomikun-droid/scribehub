import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, system, max_tokens } = body;

    // ── Use Gemini if no Anthropic key ────────────────────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (anthropicKey) {
      // Anthropic Claude
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: max_tokens || 1000,
          system,
          messages,
        }),
      });
      const data = await response.json();
      return NextResponse.json(data);

    } else if (geminiKey) {
      // Google Gemini — free tier
      const geminiMessages = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents: geminiMessages,
            generationConfig: { maxOutputTokens: max_tokens || 1000 },
          }),
        }
      );
      const data = await response.json();
      // Normalise to Anthropic format so the frontend doesn't need to change
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here — try again?";
      return NextResponse.json({ content: [{ type: 'text', text }] });

    } else {
      return NextResponse.json(
        { content: [{ type: 'text', text: "No AI key configured. Add ANTHROPIC_API_KEY or GEMINI_API_KEY to .env.local" }] }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { content: [{ type: 'text', text: "Something went wrong — try again." }] },
      { status: 500 }
    );
  }
}