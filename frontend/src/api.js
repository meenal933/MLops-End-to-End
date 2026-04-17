const BASE_URL = "/api";

// ✅ CAPTION API
export const uploadImageAndGetCaption = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/caption`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Caption API failed");
  }

  return await response.json();
};

// ✅ OBJECT DETECTION API
export const uploadImageAndDetectObjects = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Object detection API failed");
  }

  return await response.json();
};
