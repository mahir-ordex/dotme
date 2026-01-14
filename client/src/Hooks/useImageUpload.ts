// Example: client/src/Hooks/useImageUpload.ts

export async function uploadImageToServer(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    // handle error
    return null;
  }

  const data = await res.json();
  return data.url; // Cloudinary image URL
}
