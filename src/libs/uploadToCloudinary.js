export async function uploadToCloudinary(file) {
  const signRes = await fetch("/api/cloudinary", { method: "POST" });
  if (!signRes.ok) {
    const errorText = await signRes.text();
    throw new Error(
      `Couldn't get cloudinary signature: ${signRes.status} ${signRes.statusText} - ${errorText}`
    );
  }
  const { timestamp, signature, apiKey, cloudName } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("upload_preset", "e-commerce_signed");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(
      `Cloudinary upload failed: ${uploadRes.status} ${uploadRes.statusText} - ${errorText}`
    );
  }

  const uploadData = await uploadRes.json();
  return uploadData.secure_url;
}
