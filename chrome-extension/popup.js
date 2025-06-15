const API_BASE_URL = 'http://localhost:3000'

let currentSavedUrl = null

document.addEventListener('DOMContentLoaded', async () => {
  document.addEventListener('click', (event) => {
    if (event.target === document.body) {
      window.close()
    }
  })
  const loadingState = document.getElementById('loading-state')
  const successState = document.getElementById('success-state')
  const errorState = document.getElementById('error-state')
  
  try {
    const tab = await getCurrentTab()
    const token = await getAuthToken()
    
    if (!token) {
      showErrorState('認証が必要です')
      return
    }
    
    const pageInfo = await getPageInfo(tab)
    const response = await saveBookmark(pageInfo, token)
    
    console.log('Save response:', response)
    currentSavedUrl = response.data
    console.log('Current saved URL:', currentSavedUrl)
    
    chrome.runtime.sendMessage({ type: 'URL_SAVED' })
    
    showSuccessState(response.data)
    
  } catch (error) {
    console.error('Error:', error)
    showErrorState(error.message)
  }
})

function showSuccessState(savedUrl) {
  document.getElementById('loading-state').classList.add('hidden')
  document.getElementById('error-state').classList.add('hidden')
  
  const successState = document.getElementById('success-state')
  successState.classList.remove('hidden')
  
  document.getElementById('delete-btn').addEventListener('click', handleDelete)
  document.getElementById('close-btn').addEventListener('click', () => window.close())
}

function showErrorState(message) {
  document.getElementById('loading-state').classList.add('hidden')
  document.getElementById('success-state').classList.add('hidden')
  
  const errorState = document.getElementById('error-state')
  errorState.querySelector('.status').textContent = message
  errorState.classList.remove('hidden')
  
  document.getElementById('retry-btn').addEventListener('click', () => {
    location.reload()
  })
  
  document.getElementById('auth-btn').addEventListener('click', () => {
    chrome.tabs.create({
      url: `${API_BASE_URL}/auth/extension`
    })
    window.close()
  })
}

async function handleDelete() {
  if (!currentSavedUrl || !currentSavedUrl.id) {
    console.error('No saved URL or ID found:', currentSavedUrl)
    showErrorState('削除対象が見つかりません')
    return
  }
  
  const deleteBtn = document.getElementById('delete-btn')
  deleteBtn.disabled = true
  deleteBtn.textContent = '削除中...'
  
  try {
    const token = await getAuthToken()
    await deleteBookmark(currentSavedUrl.id, token)
    
    chrome.runtime.sendMessage({ type: 'URL_DELETED' })
    
    window.close()
    
  } catch (error) {
    console.error('Delete error:', error)
    deleteBtn.disabled = false
    deleteBtn.textContent = '削除に失敗しました'
    
    setTimeout(() => {
      deleteBtn.textContent = '削除'
    }, 2000)
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
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

async function getPageInfo(tab) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractPageInfo
    }, (results) => {
      const pageInfo = results[0]?.result || {}
      
      resolve({
        url: tab.url,
        title: pageInfo.title || tab.title,
        description: pageInfo.description || '',
        image_url: pageInfo.image_url || ''
      })
    })
  })
}

function extractPageInfo() {
  const title = document.title
  const description = document.querySelector('meta[name="description"]')?.content || 
                     document.querySelector('meta[property="og:description"]')?.content || ''
  const image_url = document.querySelector('meta[property="og:image"]')?.content || ''
  
  return {
    title,
    description,
    image_url
  }
}

async function saveBookmark(pageInfo, token) {
  const response = await fetch(`${API_BASE_URL}/api/urls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pageInfo)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to save bookmark')
  }
  
  const result = await response.json()
  return result
}

async function deleteBookmark(urlId, token) {
  const response = await fetch(`${API_BASE_URL}/api/urls/${urlId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete bookmark')
  }
  
  return await response.json()
}