import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { validatePhotos } from "../lib/booking-photos";
test("optional photos and strict image validation", async () => {
  assert.deepEqual(await validatePhotos(undefined), []);
  await assert.rejects(validatePhotos(["PHN2Zz48L3N2Zz4="]));
  await assert.rejects(validatePhotos(Array(4).fill("a")));
  await assert.rejects(validatePhotos(["a".repeat(1000001)]));
});
test("photos are resized and metadata is removed", async () => {
  const original = await sharp({ create: { width: 2000, height: 1500, channels: 3, background: "white" } }).jpeg().withMetadata().toBuffer();
  const [photo] = await validatePhotos([original.toString("base64")]);
  const metadata = await sharp(photo).metadata();
  assert.equal(metadata.width, 1280);
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.exif, undefined);
});
