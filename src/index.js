import esprima from './parser';
import codegen from './codegen';

import Compiler from './Compiler';
import { idWhiteListVisitor, codegenVisitor, functionRewriteVisitor } from './visitors';
import { GLOBAL } from './tags';

var c = new Compiler([
  functionRewriteVisitor({
    clamp: 'this.injected.clamp'
  }),
  idWhiteListVisitor(['datum', 'event']),
  codegenVisitor({
    Identifier: [
      { tag: GLOBAL, fn: function(n) { return 'this.injected.signals["' + n.name + '"]._value'; }}
    ]
  })
]);

console.log(c.process('Hello + clamp()'));

export function parse(input) {
  return esprima(input);
}

export function compiler(args, opt) {
  args = args.slice();
  var generator = codegen(opt),
      len = args.length,
      compile = function(str) {
        var value = generator(parse(str));
        args[len] = '"use strict"; return (' + value.code + ');';
        var fn = Function.apply(null, args);
        value.fn = (args.length > 8) ?
          function() { return fn.apply(value, arguments); } :
          function(a, b, c, d, e, f, g) {
            return fn.call(value, a, b, c, d, e, f, g);
          }; // call often faster than apply, use if args low enough
        return value;
      };
  compile.codegen = generator;
  return compile;
}

export { default as code } from './codegen';
export { default as functions } from './functions';
export { default as constants } from './constants';
export { default as Visitor } from './Visitor'
