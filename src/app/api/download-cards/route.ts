import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'tarot-cards-complete.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="tarot-cards-complete.json"',
        'Content-Length': String(fileContent.length),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
  }
}
