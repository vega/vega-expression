
export function argc(args, count, description) {
  if (args.length !== count) {
    throw new Error(description + " requires exactly " + count + " arguments (gave " + args.length + ")");
  }
}

export function isLiteral(ast) {
  return ast.type === 'Literal';
}
