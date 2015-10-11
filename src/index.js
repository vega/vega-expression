var parser = require('./parser'),
    codegen = require('./codegen'),
    findTypes = require('./find_types'),
    fns = require('./function_definitions');

var expr = module.exports = {
  parse: function(input, opt) {
      return parser.parse('('+input+')', opt);
    },
  code: function(opt) {
      return codegen(opt);
    },
  compiler: function(args, opt) {
      args = args.slice();
      args.unshift('fn');
      var generator = codegen(opt),
          len = args.length,
          compile = function(str) {
            var ast = expr.parse(str);
            findTypes(ast);
            console.log(ast);
            var value = generator(ast);
            args[len] = '"use strict"; return (' + value.code + ');';
            var generatedFn = Function.apply(null, args);
            console.log(generatedFn.toString());
            value.fn = generatedFn.bind(null, fns);
            return value;
          };
      compile.codegen = generator;
      return compile;
    },
  functions: require('./functions'),
  constants: require('./constants')
};
