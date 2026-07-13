import api from "../api/axios";

export const registerFcmToken = async (token) => {
  try {
    const device = `${navigator.platform} - ${navigator.userAgent}`;

    const response = await api.post("/fcm/register", {
      token,
      device,
    });

    return response.data;
  } catch (error) {
    console.error("Error registering FCM token:", error);
    throw error;
  }
};

export const unregisterFcmToken = async (token) => {
  try {
    const response = await api.delete("/fcm/unregister", {
      params: {
        token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error unregistering FCM token:", error);
    throw error;
  }
};