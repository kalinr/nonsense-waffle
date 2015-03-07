Template.build.events({

  //-------------BEGIN FORM CHANGE EVENTS-----------------
  'change #txtContent': function(evt){
    Session.set("sContent", evt.target.value);
  },
  /*'change #txtTitle': function(evt){
    Session.set("sTitle", evt.target.value);
  },*/
  'click #btnGetWord': function(evt){
    //TODO: maybe save aAllWords to Session so we aren't re-querying this every time... but we also need to move this to only run on the server side since this needs to be secure
    var aAllWords = colWords.find().fetch(),
      oNewWord = aAllWords[_.random(0, aAllWords.length-1)],
      aAvailableWords = Session.get('aAvailableWords');

    if(!aAvailableWords){
      aAvailableWords = [];
    }

    //loop through all the words we already have in our personal list to see if this just happens to already be there
    for(var i = 0; i<aAvailableWords.length; i++){
      if(aAvailableWords[i]._id === oNewWord._id){
        //it shouldn't happen too often that a user gets a card they already drew, so lets just return and pretend it didn't happen.
        //but we will log the event
        return;
      }
    }

    aAvailableWords.push(oNewWord);
    Session.set('aAvailableWords', aAvailableWords);

    //TODO: will probably want to split this out to some kind of view handling
    var width = 0;
    $('.wordCard').each(function() {
      width += $(this).outerWidth( true );
    });
    $('#wordOverflow').css('width', width + "px");
  },
  //add a word to your current creation's title
  'click .btnAddWord': function(evt){
    var sID = evt.target.id,
      sNewWord = sID.substr(11),//get the last part of the element's id, which corresponds to the word
      aUsedWords = Session.get("aUsedWords");

    //TODO: find out if there's a better way to set Session default values
    if(!aUsedWords){
      aUsedWords = [];
    }
    aUsedWords.push(sNewWord);//add to our list of words for this entry
    Session.set("aUsedWords", aUsedWords);
  },
  //discard a word so that it's no longer available to use
  'click .btnDiscardWord': function(evt){
    var sID = evt.target.id,
      sDiscardWord = sID.substr(15),//get the last part of the element's id, which corresponds to the word
      aAvailableWords = Session.get('aAvailableWords');
    //TODO: need to add some animation so that user can actually tell that it disappeared
    for(var i = 0; i < aAvailableWords.length; i++){
      if(aAvailableWords[i]._id === sDiscardWord){
        aAvailableWords.splice(i,1);
        //TODO: we need to do at least some of this on the server so that this is a secure action
        //I guess we'll need to be adding and removing these words from the user collection since each user should have his persistent hand of word cards
        Session.set("aAvailableWords", aAvailableWords);
        return;
      }
    }

    //TODO: add logging and error handling features (splunk!)
    console.log("Error!!!! it never found the word to delete!");
  },
  'click #btnClearTitle': function(evt){
    Session.set("aUsedWords", []);
  },
  //-------------END FORM CHANGE EVENTS-----------------

  //submit form action covers both the button click and enter button
  'submit form': function(evt){
    evt.preventDefault();

    //insert the new entry into the database, letting mongo create its _id
    colEntries.insert({
      content: Session.get("sContent"),
      title: getTitle(),
      words: Session.get("aUsedWords"),
      dateAdded: new Date()
    });

    //clear the form values
    //TODO: don't do this until we confirm that we have successfully added on the backend
    Session.set("sContent", "");
    Session.set("aUsedWords", []);
  }
});

Template.build.helpers({
  words: function() {//the word cards
    return Session.get('aAvailableWords');
  },
  sContent: function(){
    return Session.get("sContent");
  },
  sTitle: function(){
    return getTitle();
  }
});

var getTitle = function(){
  var aUsedWords = Session.get("aUsedWords");
  if(!aUsedWords){//if user hasn't selected any wordcards yet, display empty string
    return "";
  }
  return aUsedWords.join(" ");//create the title by concatenating all the words from the array with a space delimeter
}