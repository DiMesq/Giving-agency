// mission collection
Missions = new Mongo.Collection('Misson');

// users collection
Users = new Mongo.Collection('User');

// routes
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/sponsor', {
  name: 'sponsor',
});
Router.route('/user', {
  name: 'user',
});
Router.configure({
    layoutTemplate: 'main'
});

// for client
if (Meteor.isClient) {

  /* SPONSOR */
  Template.sponsor.helpers({
    'mission': function() {
      return Missions.find();
    }
  });

  Template.addMission.events({
    'submit .new-mission'(e){
      e.preventDefault();

      Missions.insert({
        name: $("[name=name]").val(),
        description: $("[name=description]").val(),
        createdAt: new Date(),
      });

      // Clear form
      $("[name=name]").val(''),
      $("[name=description]").val('User');
    },
  });

  /* USER */
  Template.getMission.events({
    'submit .get-mission'(e){

      Users.insert({
        location: $([name="location"]).val(),
      });

    }
  })
}
if (Meteor.isServer) {

}

