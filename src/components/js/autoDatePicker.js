// autoDatePicker.js
export default {
  mounted(el) {
    if (el.type === 'date' && typeof el.showPicker === 'function') {
      el.addEventListener('click', () => el.showPicker());
      el.addEventListener('focus', () => el.showPicker());
    }
  }
};