function antiShaking(fn, threshold, scope = null) {
  let time = null;
  return function () {
    const context = scope || this;
    clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(context, [...arguments]);
    }, threshold);
  };
}

export { antiShaking };
