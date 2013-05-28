People = new Meteor.Collection("people");

if (Meteor.isClient) {
    
    var handle;
    
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
            var p = Session.get("people");
            if (!_.isUndefined(p) && _.size(p) > 0) {
                console.log("starting lottery");
                handle = Meteor.setInterval(mixItUp, 250);
            }
            return false;
        },
        "click .stopLottery": function() {
            console.log("stop clicked");
            Meteor.setTimeout(stopLottery, 1000);
            return false;
        }
    });
    
    init = function() {
        console.log("init lottery");
        Session.set("people", People.find().fetch());
        Session.set("winners", []);
        if (!_.isUndefined(handle) && !_.isNull(handle)) {
            Meteor.clearInterval(handle);
        }
        handle = null;
    }
    
    mixItUp = function() {
        var p = Session.get("people");
        p = _.shuffle(p);
        Session.set("people", p);
    };
    
    stopLottery = function() {
        if (!_.isUndefined(handle) && !_.isNull(handle)) {
            console.log("stopping lottery");
            Meteor.clearInterval(handle);
            handle = null;
            var p = Session.get("people");
            var w = Session.get("winners");
            w.push(p.shift());
            Session.set("people", p);
            Session.set("winners", w);
        }
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
