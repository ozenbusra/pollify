const { AbilityBuilder, Ability } = require('@casl/ability');
const { User } = require("./models");

function defineAbilitiesFor(user) {
  const { can, rules } = new AbilityBuilder();

  if(user.role === 'Voter') {
    can('read', ['User', 'Poll']);
    can('create', 'Vote');
    can('update', 'User');
    can('delete', 'User');
  }

  if (user.role === 'Editor') {
    can('read', ['User', 'Poll']);
    can('create', ['Poll', 'Option']);
    can('update',  ['Poll', 'Option', 'User']);
    can('delete',  ['Poll', 'Option', 'User']);
  }

  if (user.role === 'Admin') {
    can('read', ['User', 'Poll']);
    can('create', ['User']);
    can('update', ['Poll', 'Option', 'User']);
    can('delete', ['Poll', 'Option', 'User']);
  }
  
  return new Ability(rules); // Create an Ability instance with the rules
}

module.exports = {
    defineAbilitiesFor,
}