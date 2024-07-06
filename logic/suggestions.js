async function getGPT3Suggestions(prompt, apiKey) {
  try {
    console.log("Fetching suggestions for prompt:", prompt);  // Debug log
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Use the appropriate model for completions
        messages: [
          {"role": "system", "content": "You are a helpful assistant that completes sentences in a formal and professional manner. You should check for spelling and grammar errors before sending the response. You should behave like GitHub Copilot and provide helpful suggestions but for completing general sentences. The idea is to create a chrome extension that helps users complete sentences in different contexts, eg. writing emails, essays, messages, tweets, etc."},
          {"role": "system", "content": `You should just complete the sentence without adding any additional information. For example, if the prompt is "Please complete the following: 'The sky is'", you should respond with "blue".`},
          {"role": "system", "content": `If the prompt is "Please complete the following: 'The sky i'", you should respond with "s blue".`},
          {"role": "system", "content": `If the prompt the prompt ends with a word or a comma, you should add a space before the completion. For example, if the prompt is "Please complete the following: 'The sky is'", you should respond with "blue".`},
          {"role": "system", "content": `If the prompt the prompt ends with a word or a comma, you should add a space before the completion. For example, if the prompt is "Please complete the following: 'Hello,'", you should respond with " my name".`},

          {"role": "user", "content": `Please complete the following: "${prompt}"`}
        ],
        max_tokens: 15, // Limit the number of tokens in the completion
        temperature: 0.3, // Adjust temperature to control randomness
        top_p: 1, // Use top-p sampling
        frequency_penalty: 0, // Control repetition
        presence_penalty: 0 // Control presence of new topics
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No choices found in the response');
    }

    const suggestion = data.choices[0].message.content.trim();
    console.log("Suggestions fetched:", suggestion);  // Debug log
    return suggestion;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return '';
  }
}

// No export statement needed
