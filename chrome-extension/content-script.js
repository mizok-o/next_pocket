window.addEventListener('message', (event) => {
  if (event.data.type === 'AUTH_SUCCESS') {
    chrome.runtime.sendMessage({
      type: 'AUTH_SUCCESS',
      token: event.data.token,
      expires_in: event.data.expires_in
    })
  }
})