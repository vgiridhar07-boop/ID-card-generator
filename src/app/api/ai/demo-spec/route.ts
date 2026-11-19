import { NextRequest, NextResponse } from 'next/server';
import { generateOfflinePresetSpec } from '@/lib/ai/gemini-service';
import { generateDynamicSvgBackground } from '@/lib/ai/svg-patterns';
import { DesignPromptInputSchema } from '@/lib/ai/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = DesignPromptInputSchema.safeParse(body);

    const description = parseResult.success
      ? parseResult.data.description
      : 'Modern collegiate university card with geometric accents';
    const orientation = parseResult.success && parseResult.data.orientation ? parseResult.data.orientation : 'portrait';
    const style = parseResult.success ? parseResult.data.style : undefined;

    const spec = generateOfflinePresetSpec(description, orientation, style);
    const width = orientation === 'portrait' ? 324 : 514;
    const height = orientation === 'portrait' ? 514 : 324;
    const svgDataUrl = generateDynamicSvgBackground(spec, width, height);

    return NextResponse.json({
      spec,
      svgDataUrl,
      isDemoMode: true,
      message: 'Loaded offline sample design preset. Rendered via local mathematical SVG engine.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to load offline sample preset' },
      { status: 500 }
    );
  }
}
