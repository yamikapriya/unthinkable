import { createWorker } from "tesseract.js";

export async function extractTextFromImage(
  file,
  onProgress
) {
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (message.status === "recognizing text") {
        onProgress?.(
          Math.round(message.progress * 100)
        );
      }
    },
  });

  try {
    const result = await worker.recognize(file);

    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}
