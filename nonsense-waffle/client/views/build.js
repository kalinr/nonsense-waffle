Template.build.events({

  //-------------BEGIN FORM CHANGE EVENTS-----------------
  'change #txtContent': function(evt){
    Session.set("sContent", evt.target.value);
  },
  /*'change #txtTitle': function(evt){
    Session.set("sTitle", evt.target.value);
  },*/
  'click .btnAddWord': function(evt){
    var sID = evt.target.id,
      sNewWord = sID.substr(11),//get the last part of the element's id, which corresponds to the word
      aWords = Session.get("aWords");

    //TODO: find out if there's a better way to set Session default values
    if(!aWords){
      aWords = [];
    }
    aWords.push(sNewWord);//add to our list of words for this entry
    Session.set("aWords", aWords);
  },
  'click #btnClearTitle': function(evt){
    Session.set("aWords", []);
  },
  //-------------END FORM CHANGE EVENTS-----------------

  //submit form action covers both the button click and enter button
  'submit form': function(evt){
    evt.preventDefault();

    //insert the new entry into the database, letting mongo create its _id
    colEntries.insert({
      content: Session.get("sContent"),
      title: getTitle(),
      words: Session.get("aWords"),
      dateAdded: Date.now()
    });

    //clear the form values
    //TODO: don't do this until we confirm that we have successfully added on the backend
    Session.set("sContent", "");
    Session.set("aWords", []);
  }
});

Template.build.helpers({
  words: function() {//the word cards
    return colWords.find();
  },
  sContent: function(){
    return Session.get("sContent");
  },
  sTitle: function(){
    return getTitle();
  }
});

var getTitle = function(){
  var aWords = Session.get("aWords");
  if(!aWords){//if user hasn't selected any wordcards yet, display empty string
    return "";
  }
  return aWords.join(" ");//create the title by concatenating all the words from the array with a space delimeter
}