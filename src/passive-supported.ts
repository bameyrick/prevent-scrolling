export let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get: () => {
      passiveSupported = true;
    },
  });

  // tslint:disable-next-line:no-empty
  window.addEventListener('test', () => {}, options);
  // tslint:disable-next-line:no-empty
} catch (err) {}
