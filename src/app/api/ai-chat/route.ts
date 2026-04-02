import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const { data: kb } = await supabase
      .from('pf_ai_knowledge').select('system_prompt_text').eq('id', 1).single();

    const systemPrompt = kb?.system_prompt_text ?? 'You are an AI assistant for Rafsan Jani.';

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat    = model.startChat({ history });
    const lastMsg = messages[messages.length - 1].content;
    const result  = await chat.sendMessageStream(lastMsg);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (err) {
    console.error('AI Chat error:', err);
    return new Response('Error processing request.', { status: 500 });
  }
}
