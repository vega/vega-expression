
module.exports = function (codegen) {
  return {
    'inRange': function(val, a, b, exclusive) {
      var min, max;
      if (a < b) {
        min = a;
        max = b;
      } else {
        min = b;
        max = a;
      }
      if (exclusive)
        return min < val && max > val;
      else
        return min <= val && max >= val;
    }
  };
}
