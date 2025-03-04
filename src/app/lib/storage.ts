"use server";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../fireBaseConfig";
import { resizeImage } from "./sharp";

interface uploadImageResponse {
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
}

export async function uploadFile(file: File): Promise<uploadImageResponse> {
  const storageRef = ref(storage, `images/${file.name}`);
  const thumbnailStorageRef = ref(storage, `thumbnails/${file.name}`);

  const fullImage = await resizeImage(file, 1280);
  const imageUrl = await uploadImageToStorage(
    new Uint8Array(fullImage),
    storageRef
  );

  const thumbnailImage = await resizeImage(file, 380);
  const thumbnailImageUrl = await uploadImageToStorage(
    new Uint8Array(thumbnailImage),
    thumbnailStorageRef
  );
  return {
    imageUrl,
    thumbnailImageUrl,
  };
}

async function uploadImageToStorage(
  file: Blob | Uint8Array | ArrayBuffer,
  storageRef: StorageReference
) {
  return new Promise<string | null>(async (resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: "image/jpeg",
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error); // Reject the promise with the error
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Resolve the promise with the download URL
        } catch (error) {
          reject(error); // Reject the promise if getDownloadURL fails
        }
      }
    );
  });
}
