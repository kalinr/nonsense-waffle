'use strict';

Meteor.startup(function () {
  //remove all records for testing purposes
  //colWords.remove({});
});

//for now we are just publishing the whole darn collection.
Meteor.publish("colEntries", function () {
  return colEntries.find();
});

Meteor.publish("colEntries", function () {
  return colEntries.find();
});


Meteor.publish("userWords", function () {
  //var q = _.sample(colWords.find().fetch());
  //return colWords.find({_id: q && q._id});

  //TODO: get this from referencing the current user object which has a list of current words
  return colWords.find();
});