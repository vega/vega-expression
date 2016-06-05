
import Visitor from './Visitor';
import { GLOBAL, BLACKLISTED, FIELD } from './tags';

// Finds all fields accessed on the variable fieldVar,
// and marks them as dependencies on the MemberExpression.
export function fieldVarVisitor(fieldVar) {
  return new Visitor({
    MemberExpression: function(node) {
      this.visitChildren(node);
      if (node.object.type === 'Identifier' && node.object.name === fieldVar) {
        node.addDependency(FIELD, node.property.name);
      }
    }
  });
}

// Given a whitelist of ids, either throws immediately,
// or tags as GLOBAL any identifiers not on the whitelist.
export function idWhiteListVisitor(list, throwImmediate) {
  var ids = {}, i, len;
  for (i = 0, len = list.length; i < len; i++) {
    ids[list[i]] = 1;
  }
  return new Visitor({
    Identifier: function(node) {
      if (!node.member && !ids.hasOwnProperty(node.name)) {
        if (throwImmediate) throw new Error("Identifier " + node.name + " is not in the whitelist.");
        node.addTag(GLOBAL);
        node.addDependency(GLOBAL, node.name);
      }
    }
  });
}

// Given a whitelist of ids, either throws immediately,
// or tags as BLACKLISTED any identifiers on the blacklist.
export function idBlackListVisitor(list, throwImmediate) {
  var ids = {}, i, len;
  for (i = 0, len = list.length; i < len; i++) {
    ids[list[i]] = 1;
  }
  return new Visitor({
    Identifier: function(node) {
      if (!node.member && ids.hasOwnProperty(node.name)) {
        if (throwImmediate) throw new Error("Identifier " + node.name + " is blacklisted.");
        node.addTag(BLACKLISTED);
      }
    }
  });
}

export function functionRewriteVisitor(functions) {
  return new Visitor({
    CallExpression: function(node) {
      if (node.callee.type !== 'Identifier') {
        throw new Error("Illegal callee type: " + node.callee.type);
      }
      var callee = node.callee.name,
          fn = functions.hasOwnProperty(callee) && functions[callee];
      if (!fn) throw new Error('Unrecognized function: ' + callee);
      if (fn instanceof Function) {
        node.type = 'RawCode';
        node.raw = fn.call(this, node);
      } else {
        node.callee.type = 'RawCode';
        node.callee.raw = fn;
      }
    }
  });
}

export function constantRewriteVisitor(constants) {
  return new Visitor({
    Identifier: function(node) {
      if (constants.hasOwnProperty(node.name)) {
        node.type = 'RawCode';
        node.raw = constants[node.name];
      }
    }
  });
}

function matchesTag(tags, node) {
  var i, len;
  if (!tags) return;
  for (i = 0, len = tags.length; i < len; i++) {
    if (!tags[i].tag || node.hasTag(tags[i].tag)) {
      return tags[i].fn;
    }
  }
}

export function codegenVisitor(opts) {
  return new Visitor({
    ArrayExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.ArrayExpression, node))) {
        return match.call(this, node);
      }
      return '[' + node.elements.map(this.visitBound).join(',') + ']';
    },
    Identifier: function(node) {
      var id = node.name;
      var match;
      if ((match = matchesTag(opts.Identifier, node))) {
        return match.call(this, node);
      }
      return node.name;
    },
    Literal: function(node) {
      var match;
      if ((match = matchesTag(opts.Literal, node))) {
        return match.call(this, node);
      }
      return node.raw;
    },
    MemberExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.MemberExpression, node))) {
        return match.call(this, node);
      }
      var obj = this.visit(node.object),
          prop = this.visit(node.property);
      return obj + (node.computed ? '[' + prop + ']' : '.' + prop);
    },
    CallExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.CallExpression, node))) {
        return match.call(this, node);
      }
      return this.visit(node.callee) + '(' + node.arguments.map(this.visitBound).join(',') + ')';
    },
    BinaryExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.BinaryExpression, node))) {
        return match.call(this, node);
      }
      return '(' + this.visit(node.left) + node.operator + this.visit(node.right) + ')';
    },
    LogicalExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.LogicalExpression, node))) {
        return match.call(this, node);
      }
      return '(' + this.visit(node.left) + node.operator + this.visit(node.right) + ')';
    },
    UnaryExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.UnaryExpression, node))) {
        return match.call(this, node);
      }
      return '(' + node.operator + this.visit(node.argument) + ')';
    },
    ConditionalExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.ConditionalExpression, node))) {
        return match.call(this, node);
      }
      return '(' + this.visit(node.test) + '?' + this.visit(node.consequent) + ':' + this.visit(node.alternate) + ')';
    },
    ObjectExpression: function(node) {
      var match;
      if ((match = matchesTag(opts.ObjectExpression, node))) {
        return match.call(this, node);
      }
      return '{' + node.properties.map(this.visitBound).join(',') + '}'
    },
    Property: function(node) {
      var match;
      if ((match = matchesTag(opts.Property, node))) {
        return match.call(this, node);
      }
      return this.visit(node.key) + ':' + this.visit(node.value);
    },
    RawCode: function(node) {
      var match;
      if ((match = matchesTag(opts.RawCode, node))) {
        return match.call(this, node);
      }
      return node.raw;
    }
  });
}
