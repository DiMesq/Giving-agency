import {Missions} from '../imports/api/missions.js';
import {Sponsors} from '../imports/api/sponsors.js';
import {Giver} from '../imports/api/giver.js';
import {UsersMissions} from '../imports/api/users_missions.js';

// routes
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/sponsor', {
  name: 'sponsor',
  template: 'sponsor',
});
Router.route('/giver', {
  name: 'giver',
  template: 'giver'
});
Router.route('/register', {
  name: 'register',
  template: 'register'
});
Router.route('/login', {
  name: 'login',
  template: 'login'
});
Router.configure({
    layoutTemplate: 'main'
});

// for client
if (Meteor.isClient) {

  /* LOGOUT */
  Template.index_navigation.events({
    'click .logout': function(e) {
      e.preventDefault();  
      Meteor.logout();
      Router.go('login');
    }

  });

  /* LOGIN */
  Template.login.events({
    'submit .login': function(e){
      e.preventDefault();
      var email = $("[name=email]").val();
      var password = $("[name=password]").val();
      Meteor.loginWithPassword(email, password);

      Router.go('giver');
    }
  })

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

  /* AGENT */
  Template.getMission.events({
    'submit .get-mission'(e){
      e.preventDefault();
      UsersMissions.insert({
        location: $("[name=location]").val(),
        createdAt: new Date(),
      });
      $("[name=location]").val('');
    }
  })

  Template.usersMissions.helpers({
    'user_mission': function(){
      return UsersMissions.find();
    }
  })

  /* REGISTER */
  Template.register.events({
    'submit .register'(e){
      e.preventDefault();
      console.log("yes");
      var email = $("[name=email]").val();
      var password = $("[name=password]").val();

      Accounts.createUser({
        email: email,
        password: password
      });
      Router.go('home');
    }
  })
}
if (Meteor.isServer) {

}

