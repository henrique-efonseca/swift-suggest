chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSuggestions') {
    const prompt = message.prompt;
    console.log("Received prompt:", prompt);  // Debug log
    chrome.storage.local.get(['apiKey'], async (result) => {
      const apiKey = result.apiKey;
      if (!apiKey) {
        console.error('API key not set.');
        sendResponse({ suggestions: 'API key not set.' });
        return;
      }
      const suggestions = await getGPT3Suggestions(prompt, apiKey);
      console.log("Sending suggestions:", suggestions);  // Debug log
      sendResponse({ suggestions: suggestions });
    });
    return true;  // Will respond asynchronously
  }
});
