"use server";
import sharp from "sharp";

export async function resizeImage(
  file: File,
  dimensions: {
    width?: number | undefined;
    height?: number | undefined;
  }
): Promise<Buffer<ArrayBufferLike>> {
  const { width, height } = dimensions;

  const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
  const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

  // Resize image with sharp
  const resizedBuffer = await sharp(buffer)
    .resize({ width, height })
    .toBuffer();

  // Convert Buffer back to File
  return resizedBuffer;
}
