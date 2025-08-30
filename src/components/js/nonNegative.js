export default {
  mounted(el) {
    el.addEventListener('keydown', e => {
      if (e.key === '-' || e.key === 'Minus') {
        e.preventDefault();
      }
    });
    el.addEventListener('input', () => {
      if (parseFloat(el.value) < 0) {
        el.value = 0;
        el.dispatchEvent(new Event('input')); // update v-model
      }
    });
  }
}
