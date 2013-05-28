People = new Meteor.Collection("people");

if (Meteor.isClient) {
    
    Template.lottery.people = function () {
        return Session.get("people");
    };
    
    Template.lottery.winners = function () {
        return Session.get("winners");
    };
    
    Template.lottery.events({
        "click .showPeople": function() {
            console.log("show clicked");
            init();
            return false;
        },
        "click .startLottery": function() {
            console.log("start clicked");
            handle = Meteor.setInterval(mixItUp, 250);
            return false;
        },
        "click .stopLottery": function() {
            console.log("stop clicked");
            Meteor.setTimeout(stopLottery, 1000);
            return false;
        }
    });
    
    init = function() {
        Session.set("people", People.find().fetch());
        Session.set("winners", []);
        Meteor.clearInterval(handle);
    }
    
    mixItUp = function() {
        var p = Session.get("people");
        p = _.shuffle(p);
        Session.set("people", p);
    };
    
    stopLottery = function() {
        Meteor.clearInterval(handle);
        var p = Session.get("people");
        var w = p.shift();
        var winners = Session.get("winners");
        winners.push(w);
        Session.set("people", p);
        Session.set("winners", winners);
    }
    
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        People.remove({});
        for (var i = 0; i < participants.length; i++) {
            People.insert({name: participants[i]});
        }
    });
}
