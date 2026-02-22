import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with one of the provided keys
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY_3 || process.env.GEMINI_KEY_4 || '');

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const occasion = formData.get('occasion') as string;
        const climate = formData.get('climate') as string;
        const outfitColor = formData.get('outfitColor') as string;

        // Get all uploaded images
        const imageFiles = formData.getAll('images') as File[];

        if (imageFiles.length === 0) {
            return NextResponse.json({ error: 'Please upload at least one perfume image.' }, { status: 400 });
        }

        if (!occasion || !climate || !outfitColor) {
            return NextResponse.json({ error: 'Please provide all contextual details.' }, { status: 400 });
        }

        // Convert standard File objects to Gemini inline data
        const imageParts = await Promise.all(
            imageFiles.map(async (file) => {
                const buffer = await file.arrayBuffer();
                return {
                    inlineData: {
                        data: Buffer.from(buffer).toString('base64'),
                        mimeType: file.type
                    }
                };
            })
        );

        // Using Gemini 2.5 Flash Lite as requested
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const prompt = `
      You are a Master Perfumer for L'Oreal Luxe. Analyze these perfume notes based on the bottles provided and create a layering ratio. 
      Context:
      Occasion: ${occasion}
      Climate: ${climate}
      Dominant outfit color: ${outfitColor}
      
      Identify the perfumes in the image(s) and their dominant notes. Then invent a luxurious layering recipe using them. 
      Recommend ONE specific L'Oreal Luxe product (like YSL Y, Prada Luna Rossa, Armani Code, Lancôme La Vie Est Belle, etc.) that would perfectly bridge the gap between these scents or complete the profile. 
      Format your response with absolute elegance and professionalism. 
      
      Structure your response exactly like this markdown:
      # Scent Synthesis Recipe
      ## Identified Notes
      [List of notes]
      ## The Layering Ratio
      [e.g., 2 sprays of X, 1 spray of Y]
      ## The L'Oreal Luxe Recommendation
      [Recommended product and why it bridges the gap]
      ## The Master Perfumer's Vision
      [A short poetic description of the final scent profile]
    `;

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        return NextResponse.json({ result: responseText });

    } catch (error: any) {
        console.error('Synthesis API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'An error occurred during scent synthesis.' },
            { status: 500 }
        );
    }
}
