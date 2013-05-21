People = new Meteor.Collection("people");

if (Meteor.isClient) {
    
    Template.lottery.people = function () {
        return People.find();
    };
    
    Template.lottery.events({
        "click": function() {
            alert("click");
        }
    });
    
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        People.remove({});
        for (var i = 0; i < participants.length; i++) {
            People.insert({name: participants[i]});
        }
    });
}
