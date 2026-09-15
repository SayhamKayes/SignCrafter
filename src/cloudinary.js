const CLOUD_NAME = "dcojcg3rt";
const UPLOAD_PRESET = "signcrafter_preset";

const getBrowserId = () => {
  let id = localStorage.getItem('signcrafter_browser_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('signcrafter_browser_id', id);
  }
  return id;
};

/**
 * Uploads an image directly to Cloudinary.
 * @param {File} file - The image file from the input.
 * @param {string} imageType - 'profile', 'company', 'banner', or 'custom'
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadImage = async (file, imageType) => {
  const browserId = getBrowserId();
  const formData = new FormData();
  
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  
  // THE FIX: We always generate a random string for EVERY upload.
  // This bypasses Cloudinary's overwrite protection and forces the browser to load the new image.
  const randomStr = Math.random().toString(36).substring(2, 8);
  const safeType = imageType || 'unknown'; 
  
  formData.append("public_id", `${safeType}_${browserId}_${randomStr}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("🔴 CLOUDINARY API REJECTED UPLOAD:", data); 
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    // Returns the direct link to the freshly created image
    return data.secure_url; 
    
  } catch (error) {
    console.error("🔴 UPLOAD ERROR:", error);
    throw error;
  }
};