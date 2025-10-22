// Uses pdfjs-dist in the browser to extract text from a PDF file with rich logs.
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"; ;

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractPdfTextInBrowser(file) {
  const start = performance.now();
  console.log("🧩 [PDF-EXTRACT] Start in-browser extraction...");
  if (!file || file.type !== "application/pdf") {
    console.warn("⚠️ [PDF-EXTRACT] Not a PDF. Returning empty.");
    return { text: "", pages: 0 };
  }

  const arrayBuffer = await file.arrayBuffer();
  console.log("📦 [PDF-EXTRACT] Bytes:", arrayBuffer.byteLength);

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  console.log("📄 [PDF-EXTRACT] Pages:", pdf.numPages);

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const pStart = performance.now();
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items?.map((it) => it.str) ?? [];
    const pageText = strings.join(" ").replace(/\s+/g, " ").trim();
    fullText += (i > 1 ? "\n\n" : "") + pageText;
    console.log(
      `📃 [PDF-EXTRACT] Page ${i}/${pdf.numPages}: ${pageText.length} chars in ${(performance.now()-pStart).toFixed(0)}ms`
    );
  }

  const MAX = 250_000; // guardrail
  const trimmed = fullText.length > MAX ? fullText.slice(0, MAX) : fullText;

  console.log("✅ [PDF-EXTRACT] Done. Total:", fullText.length, "Trimmed:", trimmed.length, "Preview:", trimmed.slice(0, 400));
  console.log(`⏱️ [PDF-EXTRACT] Total time: ${(performance.now()-start).toFixed(0)}ms`);
  return { text: trimmed, pages: pdf.numPages };
}
