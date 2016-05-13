// mission collection
Missions = new Mongo.Collection('missions');

// users collection
Users = new Mongo.Collection('users');

// users collection
UsersMissions = new Mongo.Collection('users_missions');

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
      $("[name=description]").val('');
    },
  });

  /* USER */
  Template.getMission.events({
    'submit .get-mission'(e){
      e.preventDefault();
      UsersMissions.insert({
        location: $("[name=location]").val(),
        createdAt: new Date(),
      });
      $("[name=location]").val('why not man');
    }
  })

  Template.usersMissions.helpers({
    'user_mission': function(){
      return UsersMissions.find();
    }
  })
}
if (Meteor.isServer) {

}

