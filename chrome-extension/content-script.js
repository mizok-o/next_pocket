import { MESSAGE_TYPES } from './constants.js';

window.addEventListener('message', (event) => {
  if (event.data.type === MESSAGE_TYPES.AUTH_SUCCESS) {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.AUTH_SUCCESS,
      token: event.data.token,
      expires_in: event.data.expires_in,
    });
  }
});
