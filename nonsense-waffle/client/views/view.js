Template.view.events({
  'click .entryCard': function(evt){
    var path = Router.current().url;//get the current url
    path = path.substr(0, path.indexOf('/view') + 5 );//strip it down to domain/view if we're already on an entry
    path = path + "/" + evt.target.getAttribute("entryid");//add the clicked item's entryid to our path
    Router.go(path);//go to our new path. Router automatically triggers view update
  }
});

Template.view.helpers({
  oEntry: function(){
    //get the first entry object from the array that matches our current sEntryID
    return colEntries.find({_id:Router.current().params.sEntryID}).fetch()[0];
  },
  //TODO: change this to return some random list of entries or selectable set of entries (e.g. "my friends recent entries" or "most favorited")
  entries: function(){
    return colEntries.find();
  }
});
