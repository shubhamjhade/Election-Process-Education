document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const loadingIndicator = document.getElementById('loading-indicator');

  // Simple Markdown parser
  function parseMarkdown(text) {
    let parsedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    // Simple bullet point conversion
    parsedText = parsedText.replace(/(?:^|\n)\* (.*)/g, '<ul><li>$1</li></ul>');
    parsedText = parsedText.replace(/<\/ul><br><ul>/g, ''); // Fix adjacent lists
    return parsedText;
  }

  function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (sender === 'ai') {
      contentDiv.innerHTML = parseMarkdown(text);
    } else {
      contentDiv.textContent = text;
    }
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = userInput.value.trim();
    if (!text) return;
    
    // Append user message
    appendMessage(text, 'user');
    userInput.value = '';
    
    // Disable input while fetching
    userInput.disabled = true;
    sendButton.disabled = true;
    loadingIndicator.classList.remove('hidden');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        appendMessage(data.response, 'ai');
      } else {
        appendMessage(data.error || 'Sorry, I encountered an error. Please try again.', 'ai');
      }
    } catch (error) {
      appendMessage('Network error. Please check your connection and try again.', 'ai');
    } finally {
      // Re-enable input
      userInput.disabled = false;
      sendButton.disabled = false;
      loadingIndicator.classList.add('hidden');
      userInput.focus();
    }
  });
});
