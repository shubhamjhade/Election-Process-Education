// Enhance accessibility dynamically
document.addEventListener('DOMContentLoaded', () => {
  // Focus management: ensure focus ring is visible only on keyboard navigation
  document.body.addEventListener('mousedown', function() {
    document.body.classList.add('using-mouse');
  });

  document.body.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });

  // Example of using ARIA live regions for announcements
  // Screen readers will read anything added to elements with aria-live="polite"
});
