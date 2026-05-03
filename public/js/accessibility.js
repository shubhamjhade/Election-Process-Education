'use strict';
/**
 * @fileoverview Accessibility enhancements — keyboard vs mouse detection,
 * focus trapping, and screen reader announcements.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mouse vs keyboard detection for focus styles
  document.body.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.remove('using-mouse');
  });

  // Keyboard shortcut: Ctrl+Enter to submit from anywhere
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const form = document.getElementById('chat-form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // Auto-focus input on page load
  const input = document.getElementById('user-input');
  if (input) input.focus();
});
