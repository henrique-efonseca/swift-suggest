chrome.storage.local.get(['isEnabled'], function(result) {
  if (result.isEnabled) {  // Only add listeners if the extension is enabled
    attachEventListeners();
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "toggleExtension") {
    if (message.enabled) {
      attachEventListeners();
    } else {
      detachEventListeners();
      removePrediction();  // Remove the prediction span when disabling the extension
    }
  }
});

function handleInput(event) {
  console.log("Input event triggered");
  if (event.target.isContentEditable || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
    const text = event.target.value || event.target.innerText;
    requestSuggestions(text);
  }
}

function keyDownHandler(event) {
  console.log("Keydown event: ", event.key);
  if (event.key === 'Tab') {
    event.preventDefault();
    const predictionSpan = document.querySelector('.prediction-span');
    if (predictionSpan) {
      const target = document.activeElement;
      if (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        target.value = target.value + predictionSpan.textContent; // Append the prediction text to the input
        predictionSpan.remove(); // Remove the prediction span after insertion
      }
    }
  }
}

function attachEventListeners() {
  document.addEventListener('input', handleInput);
  document.addEventListener('keydown', keyDownHandler);
}

function detachEventListeners() {
  document.removeEventListener('input', handleInput);
  document.removeEventListener('keydown', keyDownHandler);
}

function requestSuggestions(text) {
  console.log('Requesting suggestions for:', text);  // Log the text to console
  chrome.runtime.sendMessage({ action: "getSuggestions", prompt: text }, function(response) {
    const suggestion = response.suggestions;
    console.log('Received suggestion:', suggestion);  // Log the suggestion to console
    showPrediction(document.activeElement, suggestion);
  });
}

function showPrediction(inputElement, prediction) {
  let predictionSpan = document.querySelector('.prediction-span');
  if (!predictionSpan) {
    predictionSpan = document.createElement('span');
    predictionSpan.className = 'prediction-span';
    document.body.appendChild(predictionSpan);
  }

  // Set the prediction text and position the span
  predictionSpan.textContent = prediction;
  console.log("Prediction text set to:", predictionSpan.textContent);  // Debug log


  // Use textarea-caret-position to get the caret position
  const caretCoordinates = new CaretCoordinates(inputElement);
  const coords = caretCoordinates.get(inputElement.selectionStart, inputElement.selectionEnd);
  const rect = inputElement.getBoundingClientRect();

  predictionSpan.style.position = 'absolute';
  predictionSpan.style.left = `${rect.left + window.scrollX + coords.left}px`;
  predictionSpan.style.top = `${rect.top + window.scrollY + coords.top}px`;
}

function removePrediction() {
  const predictionSpan = document.querySelector('.prediction-span');
  if (predictionSpan) {
    predictionSpan.remove();
  }
}
