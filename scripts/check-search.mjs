import assert from "node:assert/strict";
const base = (process.env.TEST_BASE_URL || "https://airconpartner.kr").replace(
  /\/$/,
  "",
);
const canonicalBase = "https://airconpartner.kr";
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
const urls = [
  ...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => m[1]);
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.includes(`${canonicalBase}/about`));
const titles = new Set();
for (let offset = 0; offset < urls.length; offset += 5) {
  await Promise.all(
    urls.slice(offset, offset + 5).map(async (url) => {
      assert.equal(new URL(url).origin, canonicalBase);
      assert.ok(!/\/(api|admin|privacy)(\/|$)/.test(new URL(url).pathname));
      const response = await fetch(base + new URL(url).pathname);
      assert.equal(response.status, 200, url);
      const html = await response.text();
      assert.ok(
        html.includes(`rel="canonical" href="${url}"`),
        `Canonical: ${url}`,
      );
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, url);
      assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), url);
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
      assert.ok(
        title && !titles.has(title),
        `Missing or duplicate title: ${url}`,
      );
      titles.add(title);
      for (const match of html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ))
        JSON.parse(match[1]);
    }),
  );
}
const robots = await (await fetch(`${base}/robots.txt`)).text();
assert.ok(robots.includes(`Sitemap: ${canonicalBase}/sitemap.xml`));
assert.ok(
  robots.includes("Disallow: /api/") && robots.includes("Disallow: /admin"),
);
for (const agent of [
  "Googlebot",
  "bingbot",
  "Yeti",
  "OAI-SearchBot",
  "PerplexityBot",
]) {
  assert.equal(
    (await fetch(base + "/about", { headers: { "User-Agent": agent } })).status,
    200,
    agent,
  );
}
console.log(
  `PASS: ${urls.length} canonical pages, titles, H1, structured data, sitemap and crawler access.`,
);
