const MESSAGE_TYPES = {
  SAVE_URL: "SAVE_URL",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  SAVE_SUCCESS: "SAVE_SUCCESS",
  SAVE_ERROR: "SAVE_ERROR",
};

window.addEventListener("message", (event) => {
  if (event.data.type === MESSAGE_TYPES.AUTH_SUCCESS) {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.AUTH_SUCCESS,
      token: event.data.token,
      expires_in: event.data.expires_in,
    });
  }
});
