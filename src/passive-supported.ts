export let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get: () => {
      passiveSupported = true;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.addEventListener('test', () => {}, options);
  // eslint-disable-next-line no-empty
} catch (err) {}
