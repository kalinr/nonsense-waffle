

if (Meteor.isClient) {

  Template.admin.events({

    //-------------BEGIN FORM CHANGE EVENTS-----------------
    'change [name=optWordType]': function(e,t){
      Session.set('sType', e.target.value);
    },
    'change [name=optCollectionType]': function(e,t){
      Session.set('sCollectionType', e.target.value);
    },
    'change #txtWordDescription': function(evt){
      Session.set('sDescription', evt.target.value);
    },
    'change #txtNewWord': function(evt){
      Session.set('sNewWord', evt.target.value);
    },
    'change #txtImport': function(evt){
      Session.set('sImport', evt.target.value);
    },
    'click #btnClearWords': function(evt){
      /*
      //Okay, this doesn't work because this client-side code isn't trusted. Doing this manually in server.js instead
      if(confirm("Are you sure you want to delete all records from the word database. Please don't do this unless you know what you're doing. All the words will be gone from the game if you do.")) {
        colWords.remove({});
      }*/
    },
    //-------------END FORM CHANGE EVENTS-----------------

    //submit form action covers both the button click and enter button
    'submit #formNewWord': function(evt){
      evt.preventDefault();

      //insert the new word into the database, using the word itself as its unique ID
      colWords.insert({
        _id: Session.get('sNewWord'),
        description: Session.get('sDescription'),
        type: Session.get('sType'),
        dateAdded: new Date()
      });

      Session.set('sType', '');
      Session.set('sDescription', '');
      Session.set('sNewWord', '');
    },

    //submit form action covers both the button click and enter button
    'submit #formGetJSON': function(evt){
      evt.preventDefault();
      var sCollectionType = Session.get('sCollectionType'),
        oOutput;

      switch(sCollectionType){
        case "colWords":
          oOutput = colWords.find().fetch();
          break;
        case "colEntries":
          oOutput = colEntries.find().fetch();
          break;
        case "colUsers":
          break;
        default :
          console.log("something strange happened with sCollectionType");
          break;
      }
      Session.set("sJSONOutput", JSON.stringify(oOutput) );
    },

    //this takes one of three files that I created by copying and pasting the google app engine datastore into txt files in the dev directory
    //adjectivesExport.txt, nounExport.txt and verbExport.txt (I had three separate tables in the app engine version)
    //copy/paste the entire textfile into the textfield at the bottom of the admin page and hit submit to convert it into
    //the words mongodb collection
    'submit #formImport': function(evt){
      evt.preventDefault();

      var sData = Session.get('sImport'),
        sType = sData.substr(0, 4),//grab the type from the top of the file
        aWords = sData.split(' *+'),//I put a " *+' between each of them
        aDocuments = [],
        nCount = 0;

      if(sType === 'adje'){//complete the word 'adjective' not necessary for 'noun' and 'verb' because those are already 4 characters
        sType = 'adjective';
      }

      for(var i=0; i<aWords.length; i++){
        switch(i % 4){//each entry had four pieces of data.
          case 0://ignore the old id
          case 1://ignore the old date
            continue;
            break;
          case 2:
            //create the new object, with our type and set the date to now()
            aDocuments[nCount] = {type:sType, description:aWords[i], dateAdded:new Date()};
            break;
          case 3:
            aDocuments[nCount]._id = aWords[i];

            //not sure why inserting the whole array at once is not working so we just do it on this loop instead
            colWords.insert(aDocuments[nCount]);
            nCount++;
            break;
        }
      }

      Session.set('sImport', '');
    }

  });

  Template.admin.helpers({
    words: function() {
      return colWords.find();
    },
    sDescription: function(){
      return Session.get('sDescription');
    },
    sNewWord: function(){
      return Session.get('sNewWord');
    },
    sType: function(){
      return Session.get('sType');
    },
    sJSONOutput: function(){
      return Session.get('sJSONOutput');
    },
    sImport: function(){
      return Session.get('sImport');
    }
  });
}