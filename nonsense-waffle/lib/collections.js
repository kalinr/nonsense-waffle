/*
Lists = new Meteor.Collection('lists');


// Calculate a default name for a list in the form of 'List A'
Lists.defaultName = function() {
  var nextLetter = 'A', nextName = 'List ' + nextLetter;
  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'List ' + nextLetter;
  }

  return nextName;
};

Todos = new Meteor.Collection('todos');
*/

//TODO: when this file gets large enough to be split, we should move it out of lib and into collections directory

colWords = new Meteor.Collection('words');