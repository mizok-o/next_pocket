import {
  API_BASE_URL,
  MESSAGE_TYPES,
  META_SELECTORS,
  STORAGE_KEYS,
  TIMEOUTS,
} from "./constants.js";

let currentSavedUrl = null;

document.addEventListener("DOMContentLoaded", async () => {
  document.addEventListener("click", (event) => {
    if (event.target === document.body) {
      window.close();
    }
  });

  try {
    const tab = await getCurrentTab();
    const token = await getAuthToken();

    if (!token) {
      showErrorState("認証が必要です");
      return;
    }

    const pageInfo = await getPageInfo(tab);
    const response = await saveBookmark(pageInfo, token);

    currentSavedUrl = response.data;

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.URL_SAVED });

    showSuccessState(response.data);
  } catch (error) {
    showErrorState(error.message);
  }
});

function showSuccessState(_savedUrl) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("error-state").classList.add("hidden");

  const successState = document.getElementById("success-state");
  successState.classList.remove("hidden");

  document.getElementById("delete-btn").addEventListener("click", handleDelete);
  document.getElementById("close-btn").addEventListener("click", () => window.close());
}

function showErrorState(message) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("success-state").classList.add("hidden");

  const errorState = document.getElementById("error-state");
  errorState.querySelector(".status").textContent = message;
  errorState.classList.remove("hidden");

  document.getElementById("retry-btn").addEventListener("click", () => {
    location.reload();
  });

  document.getElementById("auth-btn").addEventListener("click", () => {
    chrome.tabs.create({
      url: `${API_BASE_URL}/auth/extension`,
    });
    window.close();
  });
}

async function handleDelete() {
  if (!currentSavedUrl || !currentSavedUrl.id) {
    showErrorState("削除対象が見つかりません");
    return;
  }

  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.disabled = true;
  deleteBtn.textContent = "削除中...";

  try {
    const token = await getAuthToken();
    await deleteBookmark(currentSavedUrl.id, token);

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.URL_DELETED });

    window.close();
  } catch (_error) {
    deleteBtn.disabled = false;
    deleteBtn.textContent = "削除に失敗しました";

    setTimeout(() => {
      deleteBtn.textContent = "削除";
    }, TIMEOUTS.ERROR_MESSAGE);
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
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

async function getPageInfo(tab) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: extractPageInfo,
      },
      (results) => {
        const pageInfo = results[0]?.result || {};

        resolve({
          url: tab.url,
          title: pageInfo.title || tab.title,
          description: pageInfo.description || "",
          image_url: pageInfo.image_url || "",
        });
      }
    );
  });
}

function extractPageInfo() {
  const title = document.title;
  const description =
    document.querySelector(META_SELECTORS.DESCRIPTION)?.content ||
    document.querySelector(META_SELECTORS.OG_DESCRIPTION)?.content ||
    "";
  
  const ogImageElement = document.querySelector(META_SELECTORS.OG_IMAGE);
  const image_url = ogImageElement?.content || ogImageElement?.getAttribute('content') || "";

  return {
    title,
    description,
    image_url,
  };
}

async function saveBookmark(pageInfo, token) {
  const response = await fetch(`${API_BASE_URL}/api/urls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageInfo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save bookmark");
  }

  const result = await response.json();
  return result;
}

async function deleteBookmark(urlId, token) {
  const response = await fetch(`${API_BASE_URL}/api/urls/${urlId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete bookmark");
  }

  return await response.json();
}
