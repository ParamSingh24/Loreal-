import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        // 1. Validate API Key Existence
        const apiKey = process.env.GEMINI_KEY_3 || process.env.GEMINI_KEY_4 || '';
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server Configuration Error: No Gemini API Key found in environment variables.' },
                { status: 403 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const formData = await request.formData();

        // Core details
        const occasion = formData.get('occasion') as string;
        const climate = formData.get('climate') as string;
        const outfitColor = formData.get('outfitColor') as string;

        if (!occasion || !climate || !outfitColor) {
            return NextResponse.json({ error: 'Please provide all contextual details.' }, { status: 400 });
        }

        // Determine Entry Mode
        const entryMode = formData.get('entryMode') as string;

        // Request Assembly Arrays
        let promptParts: any[] = [];
        const modelOptions = { model: 'gemini-2.5-flash-lite' };
        const model = genAI.getGenerativeModel(modelOptions);

        // Initial Base Prompt
        const basePrompt = `
      You are a Master Perfumer for L'Oreal Luxe. Analyze the provided perfume notes and create a personalized fragrance layering ratio.
      
      Context:
      Occasion: ${occasion}
      Climate: ${climate}
      Dominant outfit color: ${outfitColor}
    `;

        if (entryMode === 'upload') {
            const imageFiles = formData.getAll('images') as File[];

            if (imageFiles.length === 0) {
                return NextResponse.json({ error: 'Please upload at least one perfume image.' }, { status: 400 });
            }

            // Convert Images
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

            promptParts = [
                ...imageParts,
                `${basePrompt}
        
        Identify the perfumes in the image(s) provided and their dominant notes.
        Then invent a luxurious layering recipe using them.`
            ];

        } else if (entryMode === 'manual') {
            const manualPerfumes = formData.get('manualPerfumes') as string;
            const homeIngredients = (formData.get('homeIngredients') as string) || "None specifically provided.";

            if (!manualPerfumes || manualPerfumes.trim() === '') {
                return NextResponse.json({ error: 'Please provide the list of perfumes you own.' }, { status: 400 });
            }

            promptParts = [
                `${basePrompt}
        
        The client currently owns the following perfumes:
        ${manualPerfumes}
        
        The client also has the following ingredients/notes available at home:
        ${homeIngredients}
        
        Identify the dominant notes of the perfumes they own, and optionally incorporate complementary elements they have at home.
        Then invent a luxurious layering recipe using them.`
            ];
        } else {
            return NextResponse.json({ error: 'Invalid entry mode.' }, { status: 400 });
        }

        // Append Output Instructions
        promptParts.push(`
      Recommend ONE specific L'Oreal Luxe product (like YSL Y, Prada Paradoxe, Armani Code, Lancôme La Vie Est Belle, Viktor&Rolf Flowerbomb, etc.) that would perfectly bridge the gap between these scents or complete the profile. 
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
    `);

        try {
            const result = await model.generateContent(promptParts);
            const responseText = result.response.text();
            return NextResponse.json({ result: responseText });
        } catch (apiError: any) {
            console.error("SDK Generate Content Error:", apiError);

            // Look for 403 Forbidden which implies unregistered callers or bad API key.
            if (apiError.message && apiError.message.includes('403')) {
                return NextResponse.json(
                    { error: `API Authentication Error: The Gemini API Key provided is either invalid or unregistered. Please check your .env file. Details: ${apiError.message}` },
                    { status: 403 }
                );
            }

            throw apiError;
        }
    } catch (error: any) {
        console.error('Synthesis API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'An error occurred during scent synthesis.' },
            { status: 500 }
        );
    }
}
