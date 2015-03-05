Router.configure({
  layoutTemplate: 'main'
});

Router.map( function () {
  this.route('/admin');
  this.route('home', {path: '/'});
  this.route('/build');

  //none of these are implemented yet:
  this.route('/settings');//game settings like language
  this.route('/profile');//info about yourself that other users can see
  this.route('/skills');//your skills and place to buy skills
  this.route('/rankings');//player rankings
  this.route('/friends');//my facebook, google etc friends

  this.route('/view', {
    path: '/view/:sEntryID',
    data: function(){
      return {sEntryID:this.params.sEntryID};
    }
  });

  //TODO: show something on a simple /view url without an entry id
  //this.route('/view');
});

