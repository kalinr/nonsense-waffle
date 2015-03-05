

if (Meteor.isClient) {

  Template.admin.events({

    //-------------BEGIN FORM CHANGE EVENTS-----------------
    'change [type=radio]': function(e,t){
      Session.set("sType", e.target.value);
    },
    'change #txtWordDescription': function(evt){
      Session.set("sDescription", evt.target.value);
    },
    'change #txtNewWord': function(evt){
      Session.set("sNewWord", evt.target.value);
    },
    //-------------END FORM CHANGE EVENTS-----------------

    //submit form action covers both the button click and enter button
    'submit form': function(evt){
      evt.preventDefault();

      //insert the new word into the database, using the word itself as its unique ID
      colWords.insert({
        _id: Session.get("sNewWord"),
        description: Session.get("sDescription"),
        type: Session.get("sType"),
        dateAdded: Date.now()
      });
    }
  });

  Template.admin.helpers({
    words: function() {
      return colWords.find();
    },
    sDescription: function(){
      return Session.get("sDescription");
    },
    sNewWord: function(){
      return Session.get("sNewWord");
    },
    sType: function(){
      return Session.get("sType");
    }
  });
}