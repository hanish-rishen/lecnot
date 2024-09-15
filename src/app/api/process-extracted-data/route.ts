import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const extractedData = await request.json();
    const generatedNotes = await generateNotesFromExtractedData(extractedData);

    return NextResponse.json({ 
      message: 'Notes generated successfully', 
      notes: generatedNotes
    }, { status: 200 });

  } catch (err) {
    console.error('Error in POST /api/process-extracted-data:', err);
    return NextResponse.json({ 
      error: 'Error processing extracted data', 
      details: (err as Error).message
    }, { status: 500 });
  }
}

async function generateNotesFromExtractedData(extractedData: any) {
  try {
    if (extractedData.elements.length === 0) {
      return 'Error generating notes: No content found in the extracted data';
    }

    const content = extractedData.elements.map((el: { content: string }) => el.content).join('\n');
    const truncatedContent = content.slice(0, 10000); // Limit to 10,000 characters

    const prompt = `Summarize the following document content:
${truncatedContent}

Generate a comprehensive summary including key points and a conclusion. The document contains ${extractedData.figures.length} figures.`;

    let model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
    let result;

    try {
      result = await model.generateContent(prompt);
    } catch (error) {
      console.warn('Error with Gemini 1.5 Pro, falling back to Gemini 1.5 Flash:', error);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
      result = await model.generateContent(prompt);
    }

    let notes = result.response.text();
    return notes;
  } catch (error) {
    console.error('Error in generateNotesFromExtractedData:', error);
    return `Error generating notes: ${(error as Error).message}. Please try again later.`;
  }
}

function getApproximatePosition(paragraph: string, fullText: string): number {
  return fullText.indexOf(paragraph) / fullText.length;
}

async function processExtractedData(extractedData: any) {
  try {
    if (!extractedData.text || extractedData.text.trim() === '') {
      throw new Error('No text found in the extracted data');
    }

    const response = await fetch('http://localhost:3000/api/process-extracted-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extractedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const processedData = await response.json();

    return {
      notes: processedData.notes,
      figures: extractedData.figures
    };
  } catch (error) {
    console.error('Error in processExtractedData:', error);
    return {
      notes: `Error processing extracted data: ${(error as Error).message}`,
      figures: extractedData.figures
    };
  }
}

async function analyzeImage(figure: any) {
  // Implementation of image analysis logic
  // For demonstration purposes, a placeholder is used
  return `Image analysis result for Figure ${figure.name}`;
}