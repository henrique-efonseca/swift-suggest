document.addEventListener('DOMContentLoaded', function() {
  const apiKeyForm = document.getElementById('apiKeyForm');
  const apiKeyInput = document.getElementById('apiKey');

  if (apiKeyForm) {
    apiKeyForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const apiKey = apiKeyInput.value;
      chrome.storage.local.set({ apiKey: apiKey }, function() {
        console.log('API key saved:', apiKey);  // Log to console for debugging
        alert('API key saved.');  // Alert the user
        apiKeyInput.value = '';  // Clear the input field after saving
        apiKeyInput.placeholder = 'API key is saved';  // Show placeholder indicating the key is saved
        apiKeyInput.type = 'password';  // Change input type to password
      });
    });
  }

  // Load the saved API key when the options page is opened
  chrome.storage.local.get(['apiKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.type = 'password';  // Change input type to password
      apiKeyInput.placeholder = 'API key is saved';  // Show placeholder indicating the key is saved
      console.log('API key loaded');  // Log to console for debugging
    }
  });

  // When the user focuses on the input field, switch back to text input
  apiKeyInput.addEventListener('focus', function() {
    apiKeyInput.type = 'text';
    apiKeyInput.placeholder = '';
  });

  // When the user leaves the input field, switch back to password if it is not empty
  apiKeyInput.addEventListener('blur', function() {
    if (apiKeyInput.value) {
      apiKeyInput.type = 'password';
      apiKeyInput.placeholder = 'API key is saved';
    }
  });
});
