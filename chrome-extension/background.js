import {
  MESSAGE_TYPES,
  MILLISECONDS_MULTIPLIER,
  STORAGE_KEYS,
} from "./constants.js";

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === MESSAGE_TYPES.AUTH_SUCCESS) {
    chrome.storage.local.set({
      [STORAGE_KEYS.JWT_TOKEN]: message.token,
      [STORAGE_KEYS.TOKEN_EXPIRES]: Date.now() + message.expires_in * MILLISECONDS_MULTIPLIER,
    });
  }


  return true;
});
