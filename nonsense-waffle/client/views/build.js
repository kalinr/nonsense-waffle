'use strict';
var bInitialized = false;

var getTitle = function () {
  var aUsedWords = Session.get('aUsedWords');
  if (!aUsedWords) {//if user hasn't selected any wordcards yet, display empty string
    return '';
  }
  return aUsedWords.join(' ');//create the title by concatenating all the words from the array with a space delimeter
};

var render = function () {
  var aAvailableWords = Session.get('aAvailableWords'),
    nWidth;

  //no need to do anything if we have no cards
  if (!aAvailableWords || aAvailableWords.length === 0) {
    return;
  }

  //get width of single word card and multiply it by total word cards
  nWidth = $('#wordOverflow .wordCard:first').outerWidth(true) * aAvailableWords.length;
  //set our container div to that width so that it scrolls horizontally inside #wordContainer
  $('#wordOverflow').css('width', nWidth + 'px');
};

var onContentChange = function () {
  Session.set('sContent', tinyMCE.get('txtContent').getContent());
};

Template.build.events({

  //-------------BEGIN FORM CHANGE EVENTS-----------------
  'click #btnGetWord': function (evt) {
    //TODO: maybe save aAllWords to Session so we aren't re-querying this every time... but we also need to move this to only run on the server side since this needs to be secure
    var aAllWords = colWords.find().fetch(),
      oNewWord = aAllWords[_.random(0, aAllWords.length - 1)],
      aAvailableWords = Session.get('aAvailableWords'),
      i;

    if (!aAvailableWords) {
      aAvailableWords = [];
    }

    //loop through all the words we already have in our personal list to see if this just happens to already be there
    for (i = 0; i < aAvailableWords.length; i++) {
      if (aAvailableWords[i]._id === oNewWord._id){
        //it shouldn't happen too often that a user gets a card they already drew, so lets just return and pretend it didn't happen.
        //but we will log the event
        console.log('drew same word card id', aAllWords.length, oNewWord._id);
        return;
      }
    }
    //save the new word
    aAvailableWords.push(oNewWord);
    Session.set('aAvailableWords', aAvailableWords);

    render();
  },

  //add a word to your current creation's title
  'click .js-btnAddWord': function (evt) {
    var sID = evt.target.id,
      sNewWord = sID.substr(11),//get the last part of the element's id, which corresponds to the word
      aUsedWords = Session.get('aUsedWords');

    //TODO: find out if there's a better way to set Session default values
    if (!aUsedWords) {
      aUsedWords = [];
    }
    aUsedWords.push(sNewWord);//add to our list of words for this entry
    Session.set('aUsedWords', aUsedWords);
  },

  //discard a word so that it's no longer available to use
  'click .js-btnDiscardWord': function(evt){
    var sID = evt.target.id,
      sDiscardWord = sID.substr(15),//get the last part of the element's id, which corresponds to the word
      aAvailableWords = Session.get('aAvailableWords'),
      i;
    //TODO: need to add some animation so that user can actually tell that it disappeared
    for (i = 0; i < aAvailableWords.length; i++) {
      if (aAvailableWords[i]._id === sDiscardWord) {
        aAvailableWords.splice(i, 1);
        //TODO: we need to do at least some of this on the server so that this is a secure action
        //I guess we'll need to be adding and removing these words from the user collection since each user should have his persistent hand of word cards
        Session.set('aAvailableWords', aAvailableWords);
        return;
      }
    }

    //TODO: add logging and error handling features (splunk!)
    console.log('Error!!!! it never found the word to delete!');
  },

  'click #btnClearTitle': function (evt) {
    Session.set('aUsedWords', []);
  },
  //-------------END FORM CHANGE EVENTS-----------------

  //submit form action covers both the button click and enter button
  'submit form': function (evt) {
    evt.preventDefault();

    //insert the new entry into the database, letting mongo create its _id
    colEntries.insert({
      content: Session.get('sContent'),
      title: getTitle(),
      words: Session.get('aUsedWords'),
      dateAdded: new Date()
    });

    //clear the form values
    //TODO: don't do this until we confirm that we have successfully added on the backend
    Session.set('sContent', '');
    Session.set('aUsedWords', []);

    //clear the content in our editor
    tinymce.get('txtContent').setContent('');
  }
});

Template.build.helpers({
  words: function () {//the word cards
    return Session.get('aAvailableWords');
  },
  sTitle: getTitle
});

Template.build.rendered = function () {

  //we must remove and then re-add the editor to make sure it appears again after leaving then coming back to this tab
  tinymce.EditorManager.execCommand('mceRemoveEditor', true, "txtContent");

  if (!bInitialized) {
    //configure the tinymce instance. Only need to do this once so we check bInitialized

    tinymceTextToSpeechInit();

    tinymce.init({
      mode: "specific_textareas",
      editor_selector: "js-buildTextarea",
      plugins: "advlist, autolink, charmap, colorpicker, emoticons, fullscreen, hr, insertdatetime, link, paste, preview, searchreplace, spellchecker, table, textcolor, wordcount, texttospeech, speechtotext",
      toolbar: "undo redo | styleselect fontselect fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor backcolor | removeformat | bullist numlist outdent indent | link | emoticons | fullscreen | texttospeech speechtotext",
      setup: function (editor) {
        editor.on('change', onContentChange);
      }
    });
  }

  bInitialized = true;

  //add tinymce editor to #txtContent
  tinymce.EditorManager.execCommand('mceAddEditor', true, "txtContent");

  //add the content to the editor if we have left this route and then come back
  var content = Session.get('sContent');
  if (content) {
    tinymce.get('txtContent').setContent(content);
  }

  //update the rest of the stuff on the page like the word card positioning
  render();
};