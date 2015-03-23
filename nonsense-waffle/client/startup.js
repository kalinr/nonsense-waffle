Session.set('speechSupported', false);
Session.set('speechEnabled', false);

Meteor.startup(function () {
  SpeechManager.init();
  Session.set('speechSupported', SpeechManager.bSpeechSupported);
  Session.set('speechEnabled', SpeechManager.bSpeechEnabled);
});
