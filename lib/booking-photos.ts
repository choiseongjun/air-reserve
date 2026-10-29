import sharp from "sharp";

export async function validatePhotos(value: unknown): Promise<Buffer[]> {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 3)
    throw new Error("사진은 최대 3장까지 첨부해 주세요.");
  const photos: Buffer[] = [];
  for (const item of value) {
    if (
      typeof item !== "string" ||
      item.length > 1000000 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(item)
    )
      throw new Error("사진 크기나 형식을 확인해 주세요.");
    try {
      const source = Buffer.from(item, "base64");
      const metadata = await sharp(source, {
        limitInputPixels: 20000000,
      }).metadata();
      if (
        !["jpeg", "png", "webp"].includes(metadata.format || "") ||
        (metadata.pages || 1) > 1
      )
        throw new Error("Unsupported image");
      // Re-encode to discard EXIF/location metadata and any non-image payload.
      const photo = await sharp(source, { limitInputPixels: 20000000 })
        .rotate()
        .resize({
          width: 1280,
          height: 1280,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 75 })
        .toBuffer();
      if (photo.length > 750000) throw new Error("Image too large");
      photos.push(photo);
    } catch {
      throw new Error(
        "사진을 읽을 수 없습니다. JPG·PNG·WebP 사진으로 다시 선택해 주세요.",
      );
    }
  }
  return photos;
}
