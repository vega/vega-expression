
module.exports = {
  'vec_add': function(a, b) {
    if (a.x != null) {
      console.log("Vector op +", a, b);
      return {x: a.x + b.x, y: a.y + b.y};
    } else {
      return a + b
    }
  },
  'vec': function(x, y) {
    return {x:x, y:y};
  },
  'vec_times': function(a, b) {
    if (a.x != null && b.x != null) {
      // TODO: is pairwise multiply right?
      return {x:a.x*b.x, y:a.y*b.y}
    } else if (a.x != null) {
      return {x: a.x * b, y: a.y * b};
    } else if (b.x != null) {
      return {x: b.x * a, y: b.y * a};
    } else {
      return a * b;
    }
  },
  'vec_sub': function(a, b) {
    if (a.x != null && b.x != null) {
      return {x: a.x - b.x, y: a.y - b.y};
    } else {
      return a - b;
    }
  },
  'vec_neg': function(a) {
    if (a.x != null) {
      return {x: -a.x, y: -a.y};
    } else {
      return -a;
    }
  },
  'vec_div': function(a, b) {
    if (a.x != null && b.x != null) {
      // TODO: is pairwise right?
      return {x: a.x/b.x, y: a.y/b.y};
    } else if (a.x != null) {
      return {x: a.x/b, y:a.y/b};
    } else if (b.y != null) {
      return {x: b.x/a, y:b.y/a};
    } else {
      return a/b;
    }
  },
  'vec_len': function(a) {
    if (a.x != null) {
      return Math.sqrt(a.x*a.x + a.y*a.y)
    } else {
      return +a;
    }
  }
}
