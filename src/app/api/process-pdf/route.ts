import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const extractedData = await request.json();
    console.log('Received extracted data:', JSON.stringify(extractedData, null, 2));

    const generatedNotes = await generateNotesFromExtractedData(extractedData);

    return NextResponse.json({ 
      message: 'Notes generated successfully', 
      notes: generatedNotes
    }, { status: 200 });

  } catch (err) {
    console.error('Error processing extracted data:', err);
    return NextResponse.json({ error: 'Error processing extracted data', details: (err as Error).message }, { status: 500 });
  }
}

async function generateNotesFromExtractedData(extractedData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

    // Generate initial notes without waiting for image analysis
    const initialPrompt = `Summarize the following document content:
${extractedData.text}

Generate a comprehensive summary including key points and a conclusion. The document contains ${extractedData.figures.length} figures and ${extractedData.tables.length} tables.

Your summary should include placeholders for figure descriptions, which will be added later. Use the format [Figure X] to indicate where each figure should be described.`;

    const initialResult = await model.generateContent(initialPrompt);
    let notes = initialResult.response.text();

    // Analyze images in batches
    const batchSize = 5;
    for (let i = 0; i < extractedData.figures.length; i += batchSize) {
      const batch = extractedData.figures.slice(i, i + batchSize);
      const imageAnalyses = await Promise.all(batch.map(analyzeImage));

      // Update notes with image analyses
      const updatePrompt = `Update the following notes with these image analyses:

${notes}

Image analyses:
${imageAnalyses.map((analysis, index) => `Figure ${i + index + 1}: ${analysis}`).join('\n')}

Replace the [Figure X] placeholders with the corresponding image analyses where appropriate.`;

      const updatedResult = await model.generateContent(updatePrompt);
      notes = updatedResult.response.text();
    }

    return notes;
  } catch (error) {
    console.error('Error in generateNotesFromExtractedData:', error);
    throw error;
  }
}

async function analyzeImage(figure: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision-001" });
    
    // Resize and compress the image
    const resizedImageBuffer = await sharp(Buffer.from(figure.data, 'base64'))
      .resize(300, 300, { fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    
    const imageData = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
    
    const result = await model.generateContent([
      "Analyze this image and provide a brief description of its content.",
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    return 'Error analyzing image';
  }
}