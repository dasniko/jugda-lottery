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
            showPeople();
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
        },
        "click .addPerson": function() {
            console.log("add clicked");
            addPerson();
            return false;
        },
        "click .initApp": function() {
            console.log("initApp clicked");
            initApp();
            return false;
        }
    });
    
    showPeople = function() {
        console.log("show people");
        Session.set("people", _.sortBy(People.find().fetch(), function(o) {return o.name}));
        Session.set("winners", []);
        if (!_.isUndefined(handle) && !_.isNull(handle)) {
            Meteor.clearInterval(handle);
        }
        handle = null;
    }
    
    mixItUp = function() {
        console.log("mixing it up...");
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
    };
    
    addPerson = function() {
        var e = document.getElementById("newPerson");
        var p = e.value;
        console.log("adding person " + p);
        e.value = "";
        e.focus();
        People.insert({name: p});
        showPeople();
    };
    
    initApp = function() {
        Meteor.call("initApp", function(o1, o2) {
            showPeople();
    });
    }
    
}

if (Meteor.isServer) {
    Meteor.methods({
        initApp: function() {
            People.remove({});
            for (var i = 0; i < participants.length; i++) {
                People.insert({name: participants[i]});
            }
        }
    });
}
