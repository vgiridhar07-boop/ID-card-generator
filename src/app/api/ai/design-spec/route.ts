import { NextRequest, NextResponse } from 'next/server';
import { generateDesignSpecWithGemini } from '@/lib/ai/gemini-service';
import { DesignPromptInputSchema } from '@/lib/ai/validation';
import { checkRateLimit } from '@/lib/ai/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`design-spec:${ip}`, 20, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before submitting another request.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = DesignPromptInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid design prompt parameters' },
        { status: 400 }
      );
    }

    const { description, style, orientation } = parseResult.data;
    const spec = await generateDesignSpecWithGemini({
      description,
      style,
      orientation: orientation || 'portrait',
    });

    return NextResponse.json({
      spec,
      isDemoMode: false,
      message: 'Design specification successfully generated with Google Gemini.',
    });
  } catch (err: any) {
    console.error('API Error in /api/ai/design-spec:', err);
    const statusCode = err.message.includes('not configured') ? 400 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error while processing Gemini design request' },
      { status: statusCode }
    );
  }
}
