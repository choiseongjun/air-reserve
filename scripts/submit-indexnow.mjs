import { readFileSync } from "node:fs";
const site = "https://airconpartner.kr";
const key = readFileSync(
  new URL("../public/indexnow-key.txt", import.meta.url),
  "utf8",
).trim();
const keyLocation = `${site}/indexnow-key.txt`;
const keyResponse = await fetch(keyLocation);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key)
  throw new Error("Deploy the verification file before submitting.");
const response = await fetch(`${site}/sitemap.xml`);
if (!response.ok) throw new Error("Cannot read production sitemap.");
const xml = await response.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);
const requested = process.argv.slice(2);
const urlList = [
  ...new Set(
    requested.length ? requested.map((path) => new URL(path, site).href) : urls,
  ),
];
if (
  !urlList.length ||
  urlList.length > 10000 ||
  urlList.some((url) => !urls.includes(url) || new URL(url).origin !== site)
)
  throw new Error(
    "Only public canonical URLs in the deployed sitemap may be submitted.",
  );
const result = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(30000),
});
if (![200, 202].includes(result.status))
  throw new Error(`IndexNow returned HTTP ${result.status}`);
console.log(
  `IndexNow received ${urlList.length} URLs (HTTP ${result.status}). This does not confirm indexing or ranking.`,
);
