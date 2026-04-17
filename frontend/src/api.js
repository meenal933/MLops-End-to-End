// src/api.js

const BASE_URL = "/api";

// ✅ Generate Caption
export const generateCaption = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/caption`, {
      method: "POST",
      body: formData,
    });

    // ❗ handle error properly
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // ✅ read ONLY once
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Caption Error:", error);
    throw error;
  }
};


// ✅ Detect Objects
export const detectObjects = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/detect`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Detection Error:", error);
    throw error;
  }
};
