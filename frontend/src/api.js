const BASE_URL = "/api";

// ✅ Caption API
export const uploadImageAndGetCaption = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/caption`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return await response.json(); // ✅ only once

  } catch (error) {
    console.error("Caption Error:", error);
    throw error;
  }
};


// ✅ Detect Objects API
export const uploadImageAndDetectObjects = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/detect`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return await response.json();

  } catch (error) {
    console.error("Detection Error:", error);
    throw error;
  }
};
