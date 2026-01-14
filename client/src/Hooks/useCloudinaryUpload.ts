import { graphQLClient } from '../client/api';

export async function getCloudinaryUploadUrl(imageType: string, imageName: string): Promise<string> {
  const query = `
    query GetPresignUrl($imageType: String!, $imageName: String!) {
      getPresignUrl(imageType: $imageType, imageName: $imageName)
    }
  `;
  const data = await graphQLClient.request(query, { imageType, imageName });
  return data.getPresignUrl;
}

export async function uploadImageToCloudinary(file: File, uploadUrl: string, uploadPreset: string): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset); // must match your unsigned preset in Cloudinary

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.secure_url;
}
