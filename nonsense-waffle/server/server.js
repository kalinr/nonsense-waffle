'use strict';

Meteor.startup(function () {
  //remove all records for testing purposes
  //colWords.remove({});
});

//for now we are just publishing the whole darn collection.
Meteor.publish("colEntries", function () {
  return colEntries.find();
});

Meteor.publish("userWords", function () {
  //var q = _.sample(colWords.find().fetch());
  //return colWords.find({_id: q && q._id});

  //TODO: get this from referencing the current user object which has a list of current words
  return colWords.find();
});

Meteor.methods({
  drawUserWord: function () {

    var aAllWords = colWords.find().fetch(),
      oNewWord = aAllWords[_.random(0, aAllWords.length - 1)];

    Meteor.users.update({_id: Meteor.user()._id}, {
      $addToSet: {
        "profile.userWords": {
          "_id": oNewWord._id,
          "description": oNewWord.description
        }
      }
    });

  }
});