"use server";
import convert from "heic-convert";

export async function convertFileToJpg(file: File): Promise<ArrayBuffer> {
  const fileBuffer = await file.arrayBuffer();
  // had to do this 'trick', because with Buffer.from() it was the only way to make it work
  const buffer = Buffer.from(fileBuffer) as unknown as ArrayBufferLike;
  const outputBuffer = await convert({
    buffer,
    format: "JPEG",
    quality: 1, // Adjust quality (0-1)
  });
  return outputBuffer;
}
