import "server-only";
import { siteUrl } from "./seo";
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Never accept a user-supplied proxy header as the trusted origin.
  return (
    origin === new URL(request.url).origin || origin === new URL(siteUrl).origin
  );
}
export async function readJson(
  request: Request,
  maxBytes = 12000,
): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("JSON request required");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty request");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
