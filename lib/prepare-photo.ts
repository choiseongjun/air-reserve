export async function preparePhoto(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 20000000
  )
    throw new Error("20MB 이하의 JPG·PNG·WebP 사진을 선택해 주세요.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "사진을 읽을 수 없습니다. JPG로 저장해 다시 선택해 주세요.",
    );
  }
  try {
    const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("사진 변환을 지원하지 않는 브라우저입니다.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.75).split(",")[1];
    if (base64.length > 1000000)
      throw new Error("사진 용량이 큽니다. 더 작은 사진을 선택해 주세요.");
    return base64;
  } finally {
    bitmap.close();
  }
}
