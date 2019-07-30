export let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get: () => {
      passiveSupported = true;
    },
  });

  window.addEventListener('test', () => {}, options);
} catch (err) {}
