'use strict';
const Template = require('./template').Template;
const Validator = require('./validator').Validator;

class Rule {
  constructor(name, info) {
    this._name = name;
    this._template = new Template(info.template);
    if (info.validators) {
      this._validator = new Validator(info.validator);
    }
  }

  is_match(query, context) {
    return this._template.is_match(query, context);
  }

  // The query is considered valid if it passes all validators for a matching template.
  // Variadic - passes all arguments down to the validators.
  is_valid() {
    if (!this._validator) {
      return true;
    }
    return validator.is_valid(...arguments);
  }
}

class Ruleset {
  constructor() {
    this.clear();
  }

  clear() {
    this._rules = [ ];
  }

  empty() {
    return this._rules.length === 0;
  }

  update(rules) {
    this._rules = rules;
  }

  // Check that a query passes at least one rule in a set
  // Returns the matching rule or undefined if no rules match
  // Variadic - extra arguments are passed down to the validators
  validate() {
    for (const rule of this._rules) {
      if (rule.is_valid(...arguments)) {
        return rule;
      }
    }
  }
}

// The any_rule is used when permissions are disabled - it allows all queries
const any_rule = new Rule('permissions_disabled', { template: 'any()' });

module.exports = { Rule, Ruleset, any_rule };
