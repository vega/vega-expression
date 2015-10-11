
function implements(type1, type2) {
  if (type1 == type2) return true;
  if (typeof type1 == 'object' && typeof type2 == 'object' && type1 != null && type2 != null) {
    return !Object.keys(type2.properties).some(function(k) {
      if (!implements(type1.properties[k], type2.properties[k])) {
        return true;
      }
      return false;
    });
  } else {
    return false;
  }
}

var point = {
  name: "point",
  properties: {
    x: "number",
    y: "number"
  }
};

var number2number = {
  name: "number->number",
  arguments: ["number"],
  result: "number"
}

var vec_un = {
  name: "point->point",
  arguments: [point],
  result: point
}

var vec_bin = {
  name: "(point, point) -> point",
  arguments: [point, point],
  result: point
};

var vec_bin_num = {
  name: "(point|number, point|number) -> point",
  fn: function() {
    return "point";
  }
}

var string2number = {
  name: "(string)->number",
  arguments: ["string"],
  result: "number"
};

var string2string = {
  name: "string->string",
  arguments: ["string"],
  result: "string"
};

binarynumber = {
  name: "(number, number)->number",
  arguments: ["number", "number"],
  result: "number"
};

var globals = {
  event: {
    name: "event",
    properties: {
      "x": "number",
      "y": "number",
      "mouseDown": "boolean"
    }
  },
  vec: {
    name: "(number,number)->point",
    arguments: ["number", "number"],
    result: point
  },
  regexp: {
    name: "(string, string)->regex",
    arguments: ["string", "string"],
    result: "regex"
  },
  test: {
    name: "(regex, string)->boolean",
    arguments: ["regex", "string"],
    result: "boolean"
  },
  length: {
    name: "(sequence)->number",
    fn: function(ast) {
      var arg = ast.arguments[0];
      if (!arg.typeOf.name == 'array' && !arg.typeOf == 'string') {
        console.warn("Argument #1 to length should be an array or string")
      }
      return "number"
    }
  },
  indexof: {
    name: "(sequence)->number",
    fn: function(ast) {
      var arg = ast.arguments[0];
      if (!arg.typeOf.name == 'array' && !arg.typeOf == 'string') {
        console.warn("Argument #1 to indexof should be an array or string")
      }
      return "number"
    }
  },
  lastindexof: {
    name: "(sequence)->number",
    fn: function(ast) {
      var arg = ast.arguments[0];
      if (!arg.typeOf.name == 'array' && !arg.typeOf == 'string') {
        console.warn("Argument #1 to lastindexof should be an array or string")
      }
      return "number"
    }
  },
  NaN: "number",
  E: "number",
  LN2: "number",
  LN10: "number",
  LOG2E: "number",
  LOG10E: "number",
  PI: "number",
  SQRT1_2: "number",
  SQRT2: "number",
  isNaN: {
    name: "number->boolean",
    arguments: ["number"],
    result: "boolean"
  },
  isFinite: {
    "name": "number->boolean",
    arguments: ["number"],
    result: "boolean"
  },

  vec_add: vec_bin,
  vec_sub: vec_bin,
  vec_times: vec_bin_num,
  vec_len: {
    name: "point->number",
    arguments: ["point"],
    result: "number"
  },
  vec_neg: vec_un,
  vec_div: vec_bin_num,
  vec_dot: {
    name: "(point,point)->number",
    arguments: ["point", "point"],
    result: "number"
  },
  abs: number2number,
  acos: number2number,
  asin: number2number,
  atan: number2number,
  ceil: number2number,
  cos: number2number,
  exp: number2number,
  floor: number2number,
  log: number2number,
  round: number2number,
  sin: number2number,
  sqrt: number2number,
  tan: number2number,
  atan2: binarynumber,
  pow: binarynumber,
  random: {
    name: "()->number",
    arguments: [],
    result: "number"
  },
  clamp: {
    name: "(number, number, number)->number",
    arguments: ["number", "number", "number"],
    result: "number"
  },
  "if": {
    name: "(boolean, a, a)->a",
    fn: function(ast) {
      if (ast.arguments[0].typeOf !== 'boolean') {
        console.warn("Argument #1 to if should be boolean");
      }
      // return the most general type of the result
      if (implements(ast.arguments[1].typeOf, ast.arguments[2].typeOf)) {
        return ast.arguments[2].typeOf;
      } else if (implements(ast.arguments[2].typeOf, ast.arguments[1].typeOf)) {
        return ast.arguments[1].typeOf;
      } else {
        console.warn("Arguments #2 and 3 to if are not compatible");
      }
    }
  },
  parseFloat: string2number,
  parseInt: string2number,
  upper: string2string,
  lower: string2string,
  slice: string2string,
  substring: string2string,
  eventX: {
    name: "(thing)->number",
    fn: function(ast) {
      return "number";
    }
  },
  eventY: {
    name: "(thing)->number",
    fn: function(ast) {
      return "number";
    }
  },
}

var comparison = function() {
  return "boolean";
};

var arithmetic = function() {
  return "number";
}

var arithmeticpoint = function(left, right) {
  if (implements(left,point) || implements(right,point) || !left || !right) {
    return point;
  } else {
    return "number";
  }
}

var pointoperations = {
  "+": "vec_add",
  "-": "vec_sub",
  "*": "vec_times",
  "u+": "vec_len",
  "u-": "vec_neg",
  "/": "vec_div"
};

var operators = {
  "+": function(left, right) {
    if (left == 'number' && right == 'number') {
      return 'number';
    } else if (left == 'string' || right == 'string') {
      return 'string';
    } else if (implements(left,point) && implements(right,point)) {
      return point;
    } else if (!left && !right) {
      return point;
    }
  },
  "==": function(left, right) {
    return "boolean";
  },
  "===": comparison,
  "!=": comparison,
  "!==": comparison,
  ">": comparison,
  "<": comparison,
  "<=": comparison,
  ">=": comparison,
  "%": arithmetic,
  "*": arithmeticpoint,
  "/": arithmeticpoint,
  "-": arithmeticpoint,
  "u-": arithmeticpoint,
  "u+": arithmeticpoint,
  "&": arithmetic,
  "|": arithmetic,
  "^": arithmetic,
  "u~": arithmetic,
  "<<": arithmetic,
  ">>": arithmetic,
  ">>>": arithmetic,
  "u!": function() {
    return "boolean";
  },
  "&&": function(left, right) {
    // TODO -- nullable types
    if (implements(left, right)) {
      return right;
    } else if (implements(right, left)) {
      return left;
    } else {
      console.warn("Arguments to && are not compatible");
    }
  },
  "||": function(left, right) {
    if (implements(left, right)) {
      return right;
    } else if (implements(right, left)) {
      return left;
    } else {
      console.warn("Arguments to || are not compatible");
    }
  }
}

var objLiteralCount = 0;
function findTypes(ast) {
  switch (ast.type) {
  case "Program":
    findTypes(ast.body[0]);
    ast.typeOf = ast.body[0].typeOf;
    break;
  case "ExpressionStatement":
    findTypes(ast.expression);
    ast.typeOf = ast.expression.typeOf;
    break;
  case "MemberExpression":
    findTypes(ast.object);
    if (!ast.object.typeOf) break;
    ast.typeOf = ast.object.typeOf.properties[ast.property.name || ast.property.value];
    break;
  case "Identifier":
    ast.typeOf = globals[ast.name];
    break;
  case "Literal":
    if (ast.regex) {
      ast.typeOf = 'regex';
    } else {
      ast.typeOf = typeof ast.value;
    }
    break;
  case "BinaryExpression": case "LogicalExpression":
    findTypes(ast.left);
    findTypes(ast.right);
    ast.typeOf = operators[ast.operator](ast.left.typeOf, ast.right.typeOf);
    if (implements(ast.typeOf, point) && pointoperations[ast.operator]) {
      ast.type = 'CallExpression';
      ast.callee = {
        type: "Identifier",
        name: pointoperations[ast.operator],
      };
      ast.arguments = [ast.left, ast.right];
      ast.left = ast.right = null;
    }
    break;
  case "UnaryExpression":
    findTypes(ast.argument);
    ast.typeOf = operators['u' + ast.operator](ast.argument.typeOf);
    if (implements(ast.argument.typeOf, point)) {
      ast.type = 'CallExpression';
      ast.callee = {
        type: "Identifier",
        name: pointoperations["u" + ast.operator]
      };
      ast.arguments = [ast.argument];
      ast.argument = null;
    }
    break;
  case "ObjectExpression":
    ast.typeOf = {
      name:"objectLiteral" + objLiteralCount++,
      properties: {}
    };
    ast.properties.forEach(function(prop) {
      var key = prop.key.value || prop.key.name;
      findTypes(prop.value);
      ast.typeOf.properties[key] = prop.value.typeOf;
    });
    break;
  case "CallExpression":
    findTypes(ast.callee);
    if (!ast.callee.typeOf) break;
    ast.arguments.forEach(function(arg, i) {
      findTypes(arg);
      if (!ast.callee.typeOf.fn && !implements(arg.typeOf, ast.callee.typeOf.arguments[i])) {
        console.warn("Warning: argument #" + (i+1) + " to " + ast.callee + " should be of type " + ast.callee.typeOf.arguments[i])
      }
    });
    if (ast.callee.typeOf.fn) {
      ast.typeOf = ast.callee.typeOf.fn(ast);
    } else {
      ast.typeOf = ast.callee.typeOf.result;
    }
    break;
  case "ArrayExpression":
    ast.typeOf = {
      name: "array",
      properties: []
    };
    ast.elements.forEach(function(el, i) {
      if (el) {
        findTypes(el);
        ast.typeOf.properties[i] = el.typeOf;
      }
    });
    break;
  case "ConditionalExpression":
    findTypes(ast.test);
    findTypes(ast.consequent);
    findTypes(ast.alternate);
    if (implements(ast.consequent.typeOf, ast.alternate.typeOf)) {
      ast.typeOf = ast.alternate.typeOf;
    } else if (implements(ast.alternate.typeOf, ast.consequent.typeOf)) {
      ast.typeOf = ast.consequent.typeOf;
    } else {
      console.warn("Warning: alternates of ternary conditional are not compatible");
    }
    break;
  default:
    console.log("Unknown AST type", ast);
  }
}

module.exports = findTypes;
