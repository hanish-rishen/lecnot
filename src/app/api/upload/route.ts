/*
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult,
  ExtractRenditionsElementType,
  SDKError,
  ServiceUsageError,
  ServiceApiError
} from "@adobe/pdfservices-node-sdk";
import fs from 'fs';
import os from 'os';
import path from 'path';
import AdmZip from 'adm-zip';

export async function POST(request: NextRequest) {
  let readStream: fs.ReadStream | undefined;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Initial setup, create credentials instance
    const clientId = process.env.PDF_SERVICES_CLIENT_ID;
    const clientSecret = process.env.PDF_SERVICES_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PDF Services credentials are not properly configured');
    }

    const credentials = new ServicePrincipalCredentials({
      clientId,
      clientSecret
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({credentials});

    // Creates an asset(s) from source file(s) and upload
    const buffer = await file.arrayBuffer();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    fs.writeFileSync(tempFilePath, Buffer.from(buffer));

    readStream = fs.createReadStream(tempFilePath);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF
    });

    // Create parameters for the job
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT, ExtractElementType.TABLES],
      elementsToExtractRenditions: [ExtractRenditionsElementType.FIGURES, ExtractRenditionsElementType.TABLES]
    });

    // Creates a new job instance
    const job = new ExtractPDFJob({inputAsset, params});

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({job});
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult
    });

    // Get content from the resulting asset(s)
    if (!pdfServicesResponse.result) {
      throw new Error('PDF Services response result is null');
    }
    const resultAsset = pdfServicesResponse.result.resource;
    const streamAsset = await pdfServices.getContent({asset: resultAsset});

    // Save the ZIP file temporarily
    const tempZipPath = path.join(os.tmpdir(), 'extract.zip');
    const writeStream = fs.createWriteStream(tempZipPath);
    await new Promise((resolve, reject) => {
      streamAsset.readStream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    // Extract the contents of the ZIP file
    const extractedData = await extractZipContents(tempZipPath);

    // Clean up the temporary ZIP file
    fs.unlinkSync(tempZipPath);

    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));

    // Process the extracted data
    const processedData = await processExtractedData(extractedData);

    if (processedData.notes.startsWith('Error processing extracted data')) {
      throw new Error(processedData.notes);
    }

    return NextResponse.json({ 
      message: 'File processed successfully', 
      data: {
        elements: extractedData.elements,
        figures: extractedData.figures.map(fig => ({
          name: fig.name,
          data: fig.data.toString('base64')
        })),
        notes: processedData.notes
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/upload:', error);
    
    let errorMessage = 'Error processing file';
    let errorDetails = (error as Error).message;
    
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  } finally {
    readStream?.destroy();
  }
}

async function extractZipContents(zipPath: string) {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  const extractedData: {
    elements: Array<{ type: 'text' | 'figure', content: string, position: number }>;
    figures: Array<{ name: string; data: Buffer }>;
  } = {
    elements: [],
    figures: []
  };

  let jsonContent;

  for (const entry of entries) {
    if (entry.entryName.endsWith('.json')) {
      jsonContent = JSON.parse(entry.getData().toString('utf8'));
      jsonContent.elements.forEach((el: any) => {
        if (el.Text && typeof el.Text === 'string') {
          extractedData.elements.push({
            type: 'text',
            content: el.Text,
            position: el.Bounds ? el.Bounds[1] : 0
          });
        } else if (el.Path && el.Path.startsWith('//Document/Figure')) {
          extractedData.elements.push({
            type: 'figure',
            content: `[Figure ${extractedData.figures.length + 1}]`,
            position: el.Bounds ? el.Bounds[1] : 0
          });
        }
      });
    } else if (entry.entryName.includes('figures/')) {
      extractedData.figures.push({
        name: entry.name,
        data: entry.getData()
      });
    }
  }

  extractedData.elements.sort((a, b) => a.position - b.position);

  return extractedData;
}

async function processExtractedData(extractedData: any) {
  try {
    if (extractedData.elements.length === 0) {
      throw new Error('No content found in the extracted data');
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

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
  const filePath = "output/ExtractTextTableWithFigureTableRendition/";
  const date = new Date();
  const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
    ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
    ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
  fs.mkdirSync(filePath, {recursive: true});
  return (`${filePath}extract${dateString}.zip`);
}
