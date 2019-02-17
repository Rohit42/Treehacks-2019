chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'getHeadlines') {
      // DO SOMETHING
  }
});