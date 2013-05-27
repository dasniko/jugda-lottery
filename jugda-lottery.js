People = new Meteor.Collection("people");

if (Meteor.isClient) {
    
    Template.lottery.people = function () {
        return Session.get("people");
    };
    
    Template.lottery.events({
        "click .showPeople": function() {
            Session.set("people", People.find().fetch());
            return false;
        },
        "click .startLottery": function() {
            handle = Meteor.setInterval(mixItUp, 250);
            return false;
        },
        "click .stopLottery": function() {
            Meteor.setTimeout(function() {Meteor.clearInterval(handle)}, 1000);
            return false;
        }
    });
    
    mixItUp = function() {
        var p = People.find().fetch();
        p = _.shuffle(p);
        Session.set("people", p);
    };
    
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        People.remove({});
        for (var i = 0; i < participants.length; i++) {
            People.insert({name: participants[i]});
        }
    });
}
