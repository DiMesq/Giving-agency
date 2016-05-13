import { Meteor } from 'meteor/meteor';

// mission collection
Missions = new Mongo.Collection('missions');

// users collection
Users = new Mongo.Collection('users');

// users collection
UsersMissions = new Mongo.Collection('users_missions');
