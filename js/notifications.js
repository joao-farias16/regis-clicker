/**
 * notifications.js — sistema de notificações (toasts).
 */

const Notifications = {
  container: null,
  maxVisible: 4,

  init() {
    this.container = document.getElementById('notifications');
  },

  push(text, type = 'default', durationMs = 4200) {
    if (!this.container) this.init();
    if (!this.container) return;

    const toast = Utils.el('div', `toast toast-${type}`);
    toast.innerHTML = `<span class="toast-text"></span>`;
    toast.querySelector('.toast-text').textContent = text;
    this.container.appendChild(toast);

    while (this.container.children.length > this.maxVisible) {
      this.container.removeChild(this.container.firstChild);
    }

    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 400);
    }, durationMs);
  }
};
