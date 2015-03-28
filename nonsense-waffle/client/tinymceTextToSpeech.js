tinymceTextToSpeechInit = function () {

  if (SpeechManager.bSpeechSupported) {
    tinymce.PluginManager.add('texttospeech', function (editor, url) {
      //we maintain our own currentlyReading flag instead of going off speechmanager.bSpeaking to avoid confusion if
      // speechmanager is speaking from somewhere else in the app since you can re-use speechmanager other places
      var bCurrentlyReading = false;

      SpeechManager.on('speakingStopped', function () {
        bCurrentlyReading = false;
        editor.fire('ReadToMeStateChanged', {state: false});
      });

      //starts reading the current text aloud. If currently reading, it stops it, so this is kind of a toggle function
      function readToMe() {

        //if it's currently speaking, just stop
        if (bCurrentlyReading) {
          SpeechManager.stopSpeaking();
          bCurrentlyReading = false;
        } else {
          SpeechManager.speak(tinymce.activeEditor.getContent());
          bCurrentlyReading = true;

          //tell the button and menu item to update their state
          editor.fire('ReadToMeStateChanged', {state: bCurrentlyReading});
        }
      }

      //Set up the button in the toolbar
      editor.addButton('texttospeech', {
        text: 'Read',
        tooltip: 'Read aloud your current content using the robot voice',
        icon: false, //icon: 'my_icon',
        onclick: readToMe,

        onPostRender: function () {
          var self = this;

          editor.on('ReadToMeStateChanged', function (e) {
            self.active(e.state);
          });
        }
      });

      // Adds a menu item to the tools menu
      editor.addMenuItem('texttospeech', {
        text: 'Read to me',
        context: 'tools',
        onclick: readToMe,

        onPostRender: function () {
          var self = this;

          editor.on('ReadToMeStateChanged', function (e) {
            self.active(e.state);
          });
        }

      });
    });
  }

  if (SpeechManager.bListenSupported) {
    tinymce.PluginManager.add('speechtotext', function (editor, url) {
      var bCurrentlyListening = false;

      SpeechManager.on('listenResult', function (evt) {
        var sCurContent = tinymce.activeEditor.getContent(),
        //nBeginIndex = sCurContent.indexOf('<speechcontent>'),
          aCurContent = sCurContent.split('<!--speech-->');

        if (aCurContent.length === 3) {

          if (evt.isFinal) {
            tinymce.activeEditor.setContent(aCurContent[0] + evt.sNewText + aCurContent[2]);
          } else {
            tinymce.activeEditor.setContent(aCurContent[0] + '<!--speech-->' + evt.sNewText + '<!--speech-->' + aCurContent[2]);
          }
        } else {

          if (aCurContent.length !== 1) {
            throw new Error("Somehow we got the wrong number of <!--speech--> tags");
          }
          tinymce.execCommand('mceInsertContent', false, '<!--speech-->' + evt.sNewText + '<!--speech-->');
        }

        //we put this if statement down here just in case the final event is also the first
        if (evt.isFinal) {
          bCurrentlyListening = false;
          SpeechManager.stopListening();
          //editor.fire('ListenToMeStateChanged', {state: false});
        }
      });

      SpeechManager.on('listeningStopped', function (evt) {
        bCurrentlyListening = false;
        editor.fire('ListenToMeStateChanged', {state: false});
      });

      //starts listening to the user
      function listenToMe() {
        //if it's currently speaking, just stop
        if (bCurrentlyListening) {
          SpeechManager.stopListening();
          bCurrentlyListening = false;
        } else {
          SpeechManager.listen();
          bCurrentlyListening = true;
          //tell the button and menu item to update their state
          editor.fire('ListenToMeStateChanged', {state: true});
        }
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

        onPostRender: function () {
          var self = this;

          editor.on('ListenToMeStateChanged', function (e) {
            self.active(e.state);
          });
        }

      });
    });
  }
}