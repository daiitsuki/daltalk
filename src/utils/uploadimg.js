// utils/uploadImage.js
import { supabase } from '../supabase';
import { resizeImage } from './resizeimg';

export const uploadImage = async (file) => {
  let resizedBlob = file;

  // 1MB = 1 * 1024 * 1024 bytes
  if (file.size > 1 * 1024 * 1024) {
    resizedBlob = await resizeImage(file, 0.5);
  }

  const cleanFileName = file.name
    .replace(/\s+/g, '_') // 공백 제거
    .replace(/[^\w.-]/g, ''); // 허용 문자 외 제거

  const fileName = `${Date.now()}_${cleanFileName}`;

  const { error } = await supabase.storage
    .from('chat-imgs')
    .upload(fileName, resizedBlob, {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable',
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('chat-imgs')
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl;
};
