const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const getBrowserId = () => {
  let id = localStorage.getItem('signcrafter_browser_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('signcrafter_browser_id', id);
  }
  return id;
};

/**
 * Uploads an image directly to Cloudinary under the dedicated folder 'signcrafter images'.
 * @param {File} file - The image file from the input.
 * @param {string} imageType - 'profile', 'company', 'banner', or 'custom'
 * @param {string} [userId] - Optional Firebase user ID for per-user folder isolation
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadImage = async (file, imageType, userId) => {
  const browserId = getBrowserId();
  const uid = userId || browserId;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Dedicated folder structure requested by user: 'signcrafter_images/<uid>'
  const targetFolder = uid ? `signcrafter_images/${uid}` : 'signcrafter_images';
  formData.append("folder", targetFolder);

  // Random string for unique ID to avoid overwriting
  const randomStr = Math.random().toString(36).substring(2, 8);
  const safeType = imageType || 'unknown';

  formData.append("public_id", `${safeType}_${uid}_${randomStr}`);

  try {
    let response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    let data = await response.json();

    // If unsigned preset forbids dynamic folder parameter, retry without folder param
    if (!response.ok && data.error?.message?.toLowerCase().includes("folder")) {
      console.warn("Retrying upload without dynamic folder parameter:", data.error?.message);
      const fallbackFormData = new FormData();
      fallbackFormData.append("file", file);
      fallbackFormData.append("upload_preset", UPLOAD_PRESET);
      fallbackFormData.append("public_id", `signcrafter_images_${safeType}_${uid}_${randomStr}`);

      response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: fallbackFormData,
        }
      );
      data = await response.json();
    }

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