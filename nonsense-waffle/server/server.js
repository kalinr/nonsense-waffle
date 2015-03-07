"use strict";

if (Meteor.isServer) {
  Meteor.startup(function () {
    //remove all records for testing purposes
    //colWords.remove({});
  });
}