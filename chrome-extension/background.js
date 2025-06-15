import {
  API_BASE_URL,
  BADGE,
  MESSAGE_TYPES,
  MILLISECONDS_MULTIPLIER,
  SPECIAL_URL_PREFIXES,
  STORAGE_KEYS,
} from './constants.js';

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await checkCurrentTabUrl(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await checkCurrentTabUrl(tabId);
  }
});

async function checkCurrentTabUrl(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);

    if (
      !tab.url ||
      tab.url.startsWith(SPECIAL_URL_PREFIXES.CHROME) ||
      tab.url.startsWith(SPECIAL_URL_PREFIXES.EXTENSION)
    ) {
      chrome.action.setBadgeText({ text: '', tabId });
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      chrome.action.setBadgeText({ text: '', tabId });
      return;
    }

    const exists = await checkUrlExists(tab.url, token);

    if (exists) {
      chrome.action.setBadgeText({ text: BADGE.SAVED_TEXT, tabId });
      chrome.action.setBadgeBackgroundColor({ color: BADGE.SAVED_COLOR, tabId });
    } else {
      chrome.action.setBadgeText({ text: '', tabId });
    }
  } catch {
    chrome.action.setBadgeText({ text: '', tabId });
  }
}

async function checkUrlExists(url, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/urls/check`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.exists;
  } catch {
    return false;
  }
}

async function getAuthToken() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.JWT_TOKEN,
    STORAGE_KEYS.TOKEN_EXPIRES,
  ]);

  if (!result[STORAGE_KEYS.JWT_TOKEN]) {
    return null;
  }

  if (result[STORAGE_KEYS.TOKEN_EXPIRES] && Date.now() > result[STORAGE_KEYS.TOKEN_EXPIRES]) {
    await chrome.storage.local.remove([STORAGE_KEYS.JWT_TOKEN, STORAGE_KEYS.TOKEN_EXPIRES]);
    return null;
  }

  return result[STORAGE_KEYS.JWT_TOKEN];
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === MESSAGE_TYPES.AUTH_SUCCESS) {
    chrome.storage.local.set({
      [STORAGE_KEYS.JWT_TOKEN]: message.token,
      [STORAGE_KEYS.TOKEN_EXPIRES]: Date.now() + message.expires_in * MILLISECONDS_MULTIPLIER,
    });
  }

  if (message.type === MESSAGE_TYPES.URL_SAVED || message.type === MESSAGE_TYPES.URL_DELETED) {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        checkCurrentTabUrl(tabs[0].id);
      }
    });
  }

  return true;
});
