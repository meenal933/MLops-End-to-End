// api.js

export const CAPTION_API = "/api/caption";
export const DETECTION_API = "/api/detect";

// Helper function
const fetchApi = async (url, options, file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      ...options,
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.error || errorData.detail || errorDetail;
      } catch {
        const textError = await response.text();
        errorDetail = `${errorDetail}: ${textError}`;
      }
      throw new Error(errorDetail);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during API call to ${url}:`, error);
    throw new Error(error.message || "Network or API error occurred.");
  }
};

// ✅ Caption (keep SAME — already working)
export const uploadImageAndGetCaption = async (file) => {
  const data = await fetchApi(`${CAPTION_API_BASE_URL}/caption`, {}, file);
  return data.caption || "";
};

// ⚠️ TRY THIS FIRST (your original)
export const uploadImageAndDetectObjects = async (file) => {
  const data = await fetchApi(`${DETECTION_API_BASE_URL}/object`, {}, file);
  return data.objects || [];
};
