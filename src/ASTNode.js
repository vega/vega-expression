
import Visitor from './Visitor'

export default function ASTNode(type) {
  this.type = type;
}

ASTNode.prototype = {};

ASTNode.prototype.addDependency = function(type, name) {
  this.dependencies = this.dependencies || {};
  this.dependencies[type] = this.dependencies[type] || {};
  this.dependencies[type][name] = true;
}

ASTNode.prototype.getDependencies = function(name) {
  var deps = {};
  new Visitor({
    '*': function(node) {
      this.visitChildren(node);
      var d = node.dependencies && node.dependencies[name];
      if (d) {
        for (var k in d) {
          if (d.hasOwnProperty(k)) {
            deps[k] = true
          }
        }
      }
    }
  }).visit(this);
  return Object.keys(deps);
};

ASTNode.prototype.addTag = function(tag) {
  this.tags = this.tags || {};
  this.tags[tag] = true;
}

ASTNode.prototype.hasTag = function(tag) {
  return this.tags && this.tags[tag];
}

ASTNode.prototype.anyChildHasTag = function(tag) {
  return new Visitor({
    '*': function(node) {
      if (node.tags && node.tags[tag]) return true;
      var results = this.visitChildren(node);
      return results && results.indexOf(true) >= 0;
    }
  }).visit(this);
};
