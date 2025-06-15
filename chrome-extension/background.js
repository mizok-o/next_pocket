const API_BASE_URL = 'http://localhost:3000'

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId)
  await checkCurrentTabUrl(activeInfo.tabId)
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tabId, tab.url)
    await checkCurrentTabUrl(tabId)
  }
})

async function checkCurrentTabUrl(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId)
    console.log('Checking URL:', tab.url)
    
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.log('Skipping special URL')
      chrome.action.setBadgeText({ text: '', tabId })
      return
    }
    
    const token = await getAuthToken()
    console.log('Auth token:', token ? 'EXISTS' : 'MISSING')
    if (!token) {
      chrome.action.setBadgeText({ text: '', tabId })
      return
    }
    
    const exists = await checkUrlExists(tab.url, token)
    console.log('URL exists in database:', exists)
    
    if (exists) {
      console.log('Setting check mark badge')
      chrome.action.setBadgeText({ text: '✓', tabId })
      chrome.action.setBadgeBackgroundColor({ color: '#16a34a', tabId })
    } else {
      console.log('Clearing badge')
      chrome.action.setBadgeText({ text: '', tabId })
    }
  } catch (error) {
    console.error('Error checking URL:', error)
    chrome.action.setBadgeText({ text: '', tabId })
  }
}

async function checkUrlExists(url, token) {
  try {
    console.log('Checking URL exists:', url)
    const response = await fetch(`${API_BASE_URL}/api/urls/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })
    
    console.log('API response status:', response.status)
    
    if (!response.ok) {
      return false
    }
    
    const result = await response.json()
    console.log('API result:', result)
    return result.exists
  } catch (error) {
    console.error('Check URL error:', error)
    return false
  }
}

async function getAuthToken() {
  const result = await chrome.storage.local.get(['jwt_token', 'token_expires'])
  
  if (!result.jwt_token) {
    return null
  }
  
  if (result.token_expires && Date.now() > result.token_expires) {
    await chrome.storage.local.remove(['jwt_token', 'token_expires'])
    return null
  }
  
  return result.jwt_token
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTH_SUCCESS') {
    chrome.storage.local.set({
      jwt_token: message.token,
      token_expires: Date.now() + (message.expires_in * 1000)
    })
  }
  
  if (message.type === 'URL_SAVED' || message.type === 'URL_DELETED') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs[0]) {
        checkCurrentTabUrl(tabs[0].id)
      }
    })
  }
  
  return true
})