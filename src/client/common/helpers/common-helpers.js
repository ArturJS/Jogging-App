export const retryAsync = (tryCallback, {attemptsCount = 5, tickTimeMS = 10, leading = true} = {}) => {
  let attemptNumber = 0;
  let timeoutId;
  const invokeTimeout = (resolve) => {
    attemptNumber++;
    if (attemptNumber > attemptsCount) {
      resolve(false);
      return;
    }
    let timeoutTimeMS = attemptNumber === 1 && leading ? 0 : tickTimeMS;

    timeoutId = setTimeout(() => {
      if (tryCallback(attemptNumber)) resolve(true);
      else invokeTimeout(resolve);
    }, timeoutTimeMS);
  };

  return {
    result: new Promise((resolve) => {
      invokeTimeout(resolve);
    }),
    cancel: () => {
      clearTimeout(timeoutId);
    }
  };
};