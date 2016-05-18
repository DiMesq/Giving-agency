import { Missions } from './imports/api/missions.js';
import { Sponsors } from './imports/api/sponsors.js';
import { Giver } from './imports/api/giver.js';
import { UsersMissions } from './imports/api/usersMissions.js';

// ROUTES
Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
  name: 'register',
  template: 'register'
});
Router.route('/giverRegister', {
  name: 'giverRegister',
  template: 'giverRegister'
});
Router.route('/sponsorRegister', {
  name: 'sponsorRegister',
  template: 'sponsorRegister',
});
Router.route('/sponsor', {
  name: 'sponsor',
  template: 'sponsor',
});
Router.route('/giver', {
  name: 'giver',
  template: 'giver'
});
Router.route('/login', {
  name: 'login',
  template: 'login'
});

// METHODS
Meteor.methods({
  
});

// for client
if (Meteor.isClient) {

  // define the data that is available in the client side
  Meteor.subscribe('sponsorMissions');
  Meteor.subscribe('userMissions');
  Meteor.subscribe('theSponsor');

  /* LOGOUT */ 
  Template.navItems.events({
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

      var email = e.target.email.value;
      var password = e.target.password.value;
      
      Meteor.loginWithPassword(email, password, function(e){
        if (e) { 
          console.log(e.reason);
        } else {
          var user = Sponsors.findOne();
          var isGiver = user===undefined;
          Router.go(isGiver ? 'giver' : 'sponsor');
        }
      })
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
        sponsor: Meteor.userId()
      });

      // Clear form
      $("[name=name]").val(''),
      $("[name=description]").val('');
    },
  });

  /* GIVER */
  Template.getMission.events({
    'submit .get-mission': function(e){
      e.preventDefault();
      UsersMissions.insert({
        location: $("input[name=location]").val(),
        createdAt: new Date(),
        giver: Meteor.userId(),
        mission: 'missionId' //TODO
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
  Template.tabContent.events({
    'submit .register'(e){
      e.preventDefault();

      var $target = $(e.target);
      var email = $target.find("input[name=email]").val();
      var password = $target.find("input[name=password]").val();
      var isGiver = $target.data('is-giver');

      Accounts.createUser({
        email: email,
        password: password,
        isGiver: isGiver
      });

      if (isGiver) {
        var first = $target.find("input[name=firstName]").val();
        var last = $target.find("input[name=lastName]").val();
        Meteor.call('giverRegister', first, last, email);
        Router.go('giver');
      } else {
        var name = $target.find("input[name=name]").val();
        var location = $target.find("input[name=location]").val();
        Meteor.call('sponsorRegister', name, location, email);
        Router.go('sponsor');
      }
    }
  })
}

if (Meteor.isServer) {
  Meteor.users.deny({
    update: function() {
      return true;
    }
  });

  Accounts.validateNewUser((user) => {
    new SimpleSchema({
      _id: {type: String},
      emails: {type: Array},
      'emails.$': {type: Object},
      'emails.$.address': {type: String},
      'emails.$.verified': {type: Boolean},
      createdAt: {type: Date},
      services: {type: Object, blackbox: true },
      isGiver: {type: Boolean}
    }).validate(user);

    return true;
  })

  Accounts.onCreateUser((options, user) => {
    user.isGiver = options.isGiver;
    return user;
  })

  Meteor.publish('sponsorMissions', function() {
    var currentUserId = this.userId;
    return Missions.find({sponsor: currentUserId});
  });

  Meteor.publish('userMissions', function() {
    var currentUserId = this.userId;
    return UsersMissions.find({giver: currentUserId});
  });

  Meteor.publish('theSponsor', function() {
    var currentUserId = this.userId;
    return Sponsors.find({meteorId: currentUserId});
  })

  Meteor.methods({
    'giverRegister': function(first, last, mail){
      Giver.insert({
        meteorId: this.userId,
        firstName: first,
        lastName: last,
        email: mail
      });
    },

    'sponsorRegister': function(name, location, mail){
      Sponsors.insert({
        meteorId: this.userId,
        name: name,
        location: location,
        email: mail
      });
    }
  });

}

