
module.exports = {
  'vec': function(x, y) {
    return {x:x, y:y};
  },
  'vec_add': function(a, b) {
    return {x: a.x + b.x, y: a.y + b.y};
  },
  'vec_times': function(a, b) {
    if (a.x != null && b.x != null) {
      return {x: a.x * b.x, y: a.y * b.y}
    } else if (a.x != null) {
      return {x: a.x * b, y: a.y * b};
    } else if (b.x != null) {
      return {x: b.x * a, y: b.y * a};
    } else {
      return a * b;
    }
  },
  'vec_dot': function(a, b) {
    return a.x * b.x + a.y * b.y;
  },
  'vec_sub': function(a, b) {
    return {x: a.x - b.x, y: a.y - b.y};
  },
  'vec_neg': function(a) {
    return {x: -a.x, y: -a.y};
  },
  'vec_div': function(a, b) {
    if (a.x != null && b.x != null) {
      // TODO: is pairwise right?
      return {x: a.x / b.x, y: a.y / b.y};
    } else if (a.x != null) {
      return {x: a.x / b, y:a.y / b};
    } else if (b.y != null) {
      return {x: a / b.x, y:a / b.y};
    } else {
      return a/b;
    }
  },
  'vec_mag': function(a) {
    if (a.x != null) {
      return Math.sqrt(a.x * a.x + a.y * a.y)
    } else {
      return +a;
    }
  },
  'vec_mag2': function(a) {
    return a.x * a.x + a.y * a.y;
  },
  'vec_fliph': function(a) {
    return {x: -a.x, y: a.y};
  },
  'vec_flipv': function(a) {
    return {x: a.x, y: -a.y};
  },
  'vec_dist': function(a, b) {
    var dx = a.x - b.x,
        dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  'vec_dist2': function(a, b) {
    var dx = a.x - b.x,
        dy = a.y - b.y;
    return dx * dx + dy * dy;
  }
}
