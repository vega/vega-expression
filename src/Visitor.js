
export default function Visitor(visitors) {
  this.visitors = visitors;
  this.visitBound = this.visit.bind(this);
}

function visit(ast) {
  if (ast === null) {
    return null;
  } else if (this.visitors.hasOwnProperty(ast.type)) {
    return this.visitors[ast.type].call(this, ast);
  } else if (this.visitors.hasOwnProperty('*')) {
    return this.visitors['*'].call(this, ast);
  } else {
    return this.visitChildren(ast);
  }
}

function getChildren(ast) {
  switch (ast.type) {
    case 'ArrayExpression':
      return ast.elements;
    case 'BinaryExpression':
    case 'LogicalExpression':
      return [ast.left, ast.right];
    case 'CallExpression':
      var args = ast.arguments.slice();
      args.unshift(ast.callee);
      return args;
    case 'ConditionalExpression':
      return [ast.test, ast.consequent, ast.alternate];
    case 'Identifier':
    case 'Literal':
    case 'RawCode':
      return [];
    case 'MemberExpression':
      return [ast.object, ast.property];
    case 'ObjectExpression':
      return ast.properties;
    case 'Property':
      return [ast.key, ast.value];
    case 'UnaryExpression':
      return [ast.argument];
  }
}

function visitChildren(ast) {
  return getChildren(ast).map(this.visitBound);
}

Visitor.prototype = {
  visit: visit,
  visitChildren: visitChildren,
  getChildren: getChildren
};
