tinymceTextToSpeechInit = function () {

  tinymce.PluginManager.add('textToSpeech', function (editor, url) {
    var bCurrentlyReading = false;

    SpeechManager.on('speechStopped', function () {
      bCurrentlyReading = false;
      editor.fire('ReadToMeStateChanged', {state: false});
    });

    //starts reading the current text aloud. If currently reading, it stops it, so this is kind of a toggle function
    function readToMe() {

      //if it's currently speaking, just stop
      if (bCurrentlyReading) {
        SpeechManager.stop();
      } else {
        SpeechManager.speak(tinymce.activeEditor.getContent());
      }

      bCurrentlyReading = !bCurrentlyReading;

      //tell the button and menu item to update their state
      editor.fire('ReadToMeStateChanged', {state: bCurrentlyReading});
    };

    //Set up the button in the toolbar
    editor.addButton('textToSpeech', {
      text: 'Read to me',
      tooltip: 'Read aloud your current content',
      icon: false, //icon: 'my_icon',
      onclick: readToMe,

      onPostRender: function() {
        var self = this;

        editor.on('ReadToMeStateChanged', function(e) {
          self.active(e.state);
        });
      }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('textToSpeech', {
      text: 'Read to me',
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
}