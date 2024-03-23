//allow the thread to take breaks while working
function chunkify(array, funcForEach, divideBy = 10) {
  array = [...array];
  let chunks = 0;
  return new Promise((resolve) => {
    function returnFunc() {
      if (array.length == 0) {
        resolve();
      } else {
        const subarr = array.splice(0, divideBy);
        for (let i = 0; i < subarr.length; i++) {
          funcForEach(subarr[i], i + chunks);
        }
        chunks += divideBy;
        setImmediate(returnFunc);
      }
    }
    returnFunc();
  });
}
module.exports = chunkify;
