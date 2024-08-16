import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/utils/supabase-server";

// Initialize Supabase client

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  const supabase = createClient();
  console.log('Received POST request');
  const { data: { user }, error } = await supabase.auth.getUser();

  try {
    console.log('Reading file from request...');
    const file = await req.arrayBuffer();
    console.log('File read successfully, byte length:', file.byteLength);

    const contentType = req.headers.get("content-type") || "application/octet-stream";
    console.log('Content-Type:', contentType);

    const fileExtension = contentType.split("/")[1] || 'bin';
    console.log('File extension:', fileExtension);

    const filename = `${nanoid()}.${fileExtension}`;
    const filePath = `${user?.id}/${filename}`;

    console.log('Generated filename:', filename);

    console.log('Uploading file to Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType,
        upsert: false
      });

    if (error) throw error;
    console.log('File uploaded successfully:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    console.log('Public URL generated:', publicUrl);

    return NextResponse.json({ 
      url: publicUrl,
      name: filename,
      size: file.byteLength,
      type: contentType 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return new Response("Upload failed", { status: 500 });
  }
}
