export function firstLetterUpperCase(word: string) {
  if (!word) {
    return "";
  }
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function formatToCLP(number: number) {
  if (typeof number !== "number") {
    return 0;
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(number);
}

export const clientResizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set new dimensions
        const scaleFactor = Math.min(
          maxWidth / img.width,
          maxHeight / img.height
        );
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Image resizing failed"));
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8 // Adjust quality (0.0 - 1.0)
        );
      };
    };
    reader.onerror = reject;
  });
};
