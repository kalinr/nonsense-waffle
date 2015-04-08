//we can put each collection in its own file, but until we reach 500 lines or so, it's easier to leave them in one

//TODO: rename 'entries' to 'waffles'
colEntries = new Meteor.Collection('entries');
Meteor.methods({
  insertWaffle: function (sContent, sTitle, aWords) {
    // Make sure the user is logged in before inserting a task
    /*if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }*/

    colEntries.insert({
      content: sContent,
      title: sTitle,
      words: aWords,
      dateAdded: new Date(),
      createUserID: Meteor.userId(),
      createUsername: Meteor.user().profile.name
    });
  }
});

colWords = new Meteor.Collection('words');
Meteor.methods({
  insertWord: function (sNewWord, sDescription, sType) {
    //TODO: add security when we implement user accounts, verifying admin permissions
    //insert the new word into the database, using the word itself as its unique ID
    colWords.insert({
      _id: sNewWord,
      description: sDescription,
      type: sType,
      dateAdded: new Date()
    });
  }
});