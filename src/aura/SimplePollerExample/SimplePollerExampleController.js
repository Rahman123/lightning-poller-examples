({
    "startPolling" : function(cmp, event, helper) {
        var startPollEvent = $A.get('e.poller:startPolling');
        console.log(startPollEvent);
        startPollEvent.setParams({
            "eventToFire":"c:MyComponentEvent",
            "pollInterval":3
        });
        startPollEvent.fire();
        
    },
    "stopPolling" : function(cmp, event, helper) {
        var stopPollEvent = $A.get('e.poller:stopPolling');
        stopPollEvent.fire();
    },
    "handleComponentEvent":function(cmp, event, helper) {
        //Do your custom processing here 
        //e.g. invoke an apex controller, refresh another component etc.
        
        //For example we are incrementing and updating a message array
        //with the current date and time stamp
        var eventCount = parseInt(cmp.get('v.eventCount'));
        var eventMsgs = cmp.get('v.eventMessages');
        eventMsgs.push(new Date()+': Received component event from poller');
        eventCount++;
        cmp.set('v.eventCount',eventCount);        
        cmp.set('v.eventMessages',eventMsgs);
        
    }
})