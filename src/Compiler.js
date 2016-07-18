
import Visitor from './Visitor';
import parse from './parser';

export default function Compiler(visitors) {
  var i, len;
  this.visitors = visitors;
  for (i = 0, len = visitors.length; i < len; i++) {
    visitors[i].compiler = this;
  }
}

Compiler.prototype = {};

// Parses the code to an ast, then runs all of the visitors on it, returning
// the result of the last one.
Compiler.prototype.process = function(code) {
  var ast = typeof code === 'string' ? parse(code) : code, i, len;
  for (i = 0, len = this.visitors.length; i < len - 1; i++) {
    this.visitors[i].visit(ast);
  }
  return { result: this.visitors[len-1].visit(ast), ast: ast };
};
