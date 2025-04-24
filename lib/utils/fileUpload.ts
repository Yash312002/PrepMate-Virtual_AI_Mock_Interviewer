import fs from 'fs';
import path from 'path';

export const saveFileLocally = async (
  file: File,
  type: 'profiles' | 'resumes'
): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
  const filepath = path.join(uploadDir, filename);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(filepath, buffer);

  // Return the public URL
  return `/uploads/${type}/${filename}`;
}