import { getSupabaseClient } from '@/lib/supabase';

export const uploadBlogImage = async (file: File): Promise<string> => {
  const supabase = getSupabaseClient();
  const extension = file.name.split('.').pop() || 'png';
  const filePath = `posts/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from('blog-images').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || 'Image upload failed.');
  }

  const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
  return data.publicUrl;
};
