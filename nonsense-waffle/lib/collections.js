//we can't "use strict" in this file; Not sure why, but if we do, it tries to force us to var colWords and colEntries, but if we do, they suddenly aren't accessible in other places

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

colWords = new Meteor.Collection('words');
colEntries = new Meteor.Collection('entries');