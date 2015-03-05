

if (Meteor.isClient) {

  Template.view.events({


  });

  Template.view.helpers({
    sEntryContent: function() {
      console.log(Router.current().params.entryID, " and ", Router.current.params);

      //replace this with using the id to get the content
      return Router.current().params.sEntryID;
    }
  });


}