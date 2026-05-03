'use strict';
/**
 * @fileoverview Main chat UI logic for Election Process Education.
 * Handles form submission, API calls, message rendering, and markdown parsing.
 */
document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const typingIndicator = document.getElementById('typing-indicator');
  const announcer = document.getElementById('sr-announcer');

  /**
   * Sanitizes a string to prevent XSS when using innerHTML.
   * @param {string} str - Raw string.
   * @returns {string} Escaped string.
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Converts basic markdown to safe HTML.
   * @param {string} text - Markdown text from AI.
   * @returns {string} HTML string.
   */
  function parseMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^## (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  }

  /**
   * Appends a message to the chat box.
   * @param {string} text - Message content.
   * @param {'user'|'ai'} sender - Who sent the message.
   */
  function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.setAttribute('role', 'article');
    messageDiv.setAttribute('aria-label', `${sender === 'ai' ? 'AI' : 'You'} said`);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar', sender === 'ai' ? 'ai-avatar' : 'user-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = sender === 'ai' ? '🤖' : '👤';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = sender === 'ai' ? parseMarkdown(text) : escapeHtml(text);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (announcer && sender === 'ai') {
      announcer.textContent = 'New response received.';
    }
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;
    typingIndicator.classList.remove('hidden');
    typingIndicator.setAttribute('aria-hidden', 'false');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await response.json();
      appendMessage(response.ok ? data.response : (data.error || 'Sorry, an error occurred.'), 'ai');
    } catch (_err) {
      appendMessage('Network error. Please check your connection and try again.', 'ai');
    } finally {
      userInput.disabled = false;
      sendButton.disabled = false;
      typingIndicator.classList.add('hidden');
      typingIndicator.setAttribute('aria-hidden', 'true');
      userInput.focus();
    }
  });
});
