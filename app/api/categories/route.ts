import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const categoryConfigPath = path.join(process.cwd(), 'models', 'categoryConfig.ts');

export async function POST(request: Request) {
  try {
    const { category, colors, backgroundColor } = await request.json();
    
    const content = await fs.readFile(categoryConfigPath, 'utf8');
    const updatedContent = content.replace(
      'export const categoryConfig: CategoryConfig = {',
      `export const categoryConfig: CategoryConfig = {
  '${category}': {
    colors: "${colors}",
    icon: FaQuestionCircle,
    backgroundColor: '${backgroundColor}',
  },`
    );

    await fs.writeFile(categoryConfigPath, updatedContent);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { category } = await request.json();
    
    const content = await fs.readFile(categoryConfigPath, 'utf8');
    const categoryRegex = new RegExp(`\\s*'${category}':\\s*{[^}]*},?\\n?`);
    const updatedContent = content.replace(categoryRegex, '');

    await fs.writeFile(categoryConfigPath, updatedContent);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 