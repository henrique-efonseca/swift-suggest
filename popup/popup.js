document.addEventListener('DOMContentLoaded', function() {
  // Set initial button state
  chrome.storage.local.get(['isEnabled'], function(result) {
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true; // Default to true if undefined
    document.getElementById('toggleButton').textContent = isEnabled ? 'Disable' : 'Enable';
  });

  // Settings button click event
  document.getElementById('settingsButton').addEventListener('click', function() {
    chrome.tabs.create({ url: '../options/options.html' });
  });

  // Toggle button click event
  document.getElementById('toggleButton').addEventListener('click', function() {
    chrome.storage.local.get(['isEnabled'], function(result) {
      let isEnabled = result.isEnabled !== undefined ? result.isEnabled : true; // Default to true if undefined
      isEnabled = !isEnabled; // Toggle the state
      chrome.storage.local.set({isEnabled: isEnabled}, function() {
        document.getElementById('toggleButton').textContent = isEnabled ? 'Disable' : 'Enable';
        chrome.runtime.sendMessage({action: "toggleExtension", enabled: isEnabled});
      });
    });
  });
});
