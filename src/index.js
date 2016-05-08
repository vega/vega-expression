import esprima from './parser';
import codegen from './codegen';

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
export { default as constants } from './constants'
