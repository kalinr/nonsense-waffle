tinymceTextToSpeechInit = function () {

  tinymce.PluginManager.add('texttospeech', function (editor, url) {
    //we maintain our own currentlyReading flag instead of going off speechmanager.bSpeaking to avoid confusion if
    // speechmanager is speaking from somewhere else in the app since you can re-use speechmanager other places
    var bCurrentlyReading = false;

    SpeechManager.on('speechStopped', function () {
      bCurrentlyReading = false;
      editor.fire('ReadToMeStateChanged', {state: false});
    });

    //starts reading the current text aloud. If currently reading, it stops it, so this is kind of a toggle function
    function readToMe() {

      //if it's currently speaking, just stop
      if (bCurrentlyReading) {
        SpeechManager.stopSpeaking();
      } else {
        SpeechManager.speak(tinymce.activeEditor.getContent());
      }

      bCurrentlyReading = !bCurrentlyReading;

      //tell the button and menu item to update their state
      editor.fire('ReadToMeStateChanged', {state: bCurrentlyReading});
    }

    //Set up the button in the toolbar
    editor.addButton('texttospeech', {
      text: 'Read',
      tooltip: 'Read aloud your current content',
      icon: false, //icon: 'my_icon',
      onclick: readToMe,

      onPostRender: function () {
        var self = this;

        editor.on('ReadToMeStateChanged', function(e) {
          self.active(e.state);
        });
      }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('texttospeech', {
      text: 'Read aloud',
      context: 'tools',
      onclick: readToMe,

      onPostRender: function() {
        var self = this;

        editor.on('ReadToMeStateChanged', function(e) {
          self.active(e.state);
        });
      }

    });
  });

  tinymce.PluginManager.add('speechtotext', function (editor, url) {

    var bCurrentlyListening = false;

    SpeechManager.on('listeningStopped', function () {
      bCurrentlyListening = false;
      editor.fire('ListenToMeStateChanged', {state: false});
    });

    //starts listening to the user
    function listenToMe() {
      //if it's currently speaking, just stop
      if (bCurrentlyListening) {
        SpeechManager.stopListening();
      } else {
        //SpeechManager.speak(tinymce.activeEditor.getContent());
        console.log("inserting text!!!");
        //tinyMCE.execCommand('mceInsertContent',false, 'blabla this is tekst');

        SpeechManager.listen();
      }

      bCurrentlyListening = !bCurrentlyListening;

      //tell the button and menu item to update their state
      editor.fire('ListenToMeStateChanged', {state: bCurrentlyListening});
    }


    //Set up the button in the toolbar
    editor.addButton('speechtotext', {
      text: 'Listen',
      tooltip: 'Talk to add text. Make sure your mic is on and click the "allow" button at the top of the browser.',
      icon: false, //icon: 'my_icon',
      onclick: listenToMe,

      onPostRender: function () {
        var self = this;

        editor.on('ListenToMeStateChanged', function (e) {
          self.active(e.state);
        });
      }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('speechtotext', {
      text: 'Listen to me',
      context: 'tools',
      onclick: listenToMe,

      onPostRender: function() {
        var self = this;

        editor.on('ListenToMeStateChanged', function (e) {
          self.active(e.state);
        });
      }

    });
  });
}