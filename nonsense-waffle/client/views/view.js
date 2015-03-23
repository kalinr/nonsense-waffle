'use strict';

Template.view.events({
  'click .entryCard': function (evt) {
    var path = Router.current().url,
      oEntry;//get the current url
    path = path.substr(0, path.indexOf('/view') + 5 );//strip it down to domain/view if we're already on an entry
    path += '/' + evt.target.getAttribute('entryid');//add the clicked item's entryid to our path
    Router.go(path);//go to our new path. Router automatically triggers view update
    //get the first entry object from the array that matches our current sEntryID
    oEntry = colEntries.find({_id: evt.target.getAttribute('entryid')}).fetch()[0]
    Session.set('oEntry', oEntry);

    SpeechManager.speak(oEntry.content);
  },
  'click #btnMute': function (evt) {
    SpeechManager.toggleEnabled();
    Session.set('speechEnabled', SpeechManager.bSpeechEnabled);
  }
});

Template.view.helpers({
  oEntry: function () {
    return Session.get('oEntry');
  },
  //TODO: change this to return some random list of entries or selectable set of entries (e.g. 'my friends recent entries' or 'most favorited')
  entries: function () {
    return colEntries.find();
  },
  speechEnabled: function () {
    return Session.get('speechEnabled');
  },
  speechSupported: function () {
    SpeechManager.init
    return Session.get('speechSupported');
  }
});



