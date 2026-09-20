import { readFile } from "node:fs/promises";
export async function testPdfDestination(fileName) {
  return { async write(blob) {
    if (!(blob instanceof Blob) || !blob.size) throw new Error("PDF vazio.");
    return { saved: true, fileName, method: "test", diskConfirmed: true };
  } };
}
export function installProposalAssetFetch() {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (typeof url === "string" && url.startsWith("/brand/")) return new Response(await readFile(new URL(`../public${url}`, import.meta.url)), { headers: { "content-type": "image/png" } });
    return original(url, options);
  };
  return () => { globalThis.fetch = original; };
}
