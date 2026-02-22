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
      You are an elite Master Perfumer for L'Oréal Luxe. Your output must be impeccably structured, authoritative, and luxurious in tone.

      Format your response EXACTLY using the following markdown structure. Do not skip or rename any section. Be specific, detailed, and professional.

      ---

      # ✦ Scent Synthesis Protocol

      ## 🧪 Fragrance Profile Analysis

      For each perfume provided, write a crisp dedicated sub-section:

      ### [Perfume Name]
      - **Top Notes:** [list the top notes]
      - **Heart Notes:** [list the heart notes]  
      - **Base Notes:** [list the base notes]
      - **Character:** [1-2 sentence description of the fragrance personality and mood]

      ${(formData.get('homeIngredients') as string) && (formData.get('homeIngredients') as string).trim() !== '' && (formData.get('homeIngredients') as string).trim() !== 'None specifically provided.' ? `
      ### 🏡 Household Ingredient Accords
      For each home ingredient provided, describe its olfactive contribution and how it will interact with the fragrances.
      ` : ''}

      ---

      ## ⚖️ The Layering Protocol

      Provide explicit, numbered application instructions for this occasion (${occasion}), climate (${climate}), and outfit color (${outfitColor}).

      **Application Order:**
      1. [First product] — [X sprays] — [where to apply, e.g., pulse points, wrist]
      2. [Second product] — [X sprays] — [application note]
      ${(formData.get('homeIngredients') as string) && (formData.get('homeIngredients') as string).trim() !== '' && (formData.get('homeIngredients') as string).trim() !== 'None specifically provided.' ? `3. [Home Ingredient] — [how to apply]` : ''}

      **Timing:** [Immediate layering vs. wait time between applications]

      **Why This Works:** [2-3 sentences on how the notes interact to create the target outcome]

      ---

      ## 💚 L'Oréal Luxe Recommendation *(Optional Finishing Touch)*

      > Recommend exactly ONE real L'Oréal-owned luxury perfume (from brands like Lancôme, YSL Beauté, Giorgio Armani Beauty, Valentino Beauty, Mugler, Prada Beauty, or Viktor&Rolf) that perfectly completes or elevates this blend.

      **Recommended Fragrance:** [Full product name with brand]

      **Why It Elevates Your Blend:**  
      [2-3 sentences explaining the specific notes it adds, which gap it fills, and why it fits this exact occasion and outfit color]

      **How To Layer It:**  
      [1 sentence on when and where to add this final touch]

      ---

      ## ✨ The Master Perfumer's Vision

      [Write a single, evocative paragraph (4-6 sentences) in the voice of a luxury poet-perfumer. Paint a sensory picture of the complete olfactive journey — from the opening spray through the dry-down. Reference the occasion, climate, and outfit color subtly. Make the client feel their scent is a work of art.]

      ---
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
