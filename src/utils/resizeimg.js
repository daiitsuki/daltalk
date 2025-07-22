// utils/resizeImage.js
export const resizeImage = (file, scale = 0.25) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context 생성 실패");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("Blob 생성 실패");
        },
        "image/jpeg",
        0.8
      ); // JPEG, 품질 0.8
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
