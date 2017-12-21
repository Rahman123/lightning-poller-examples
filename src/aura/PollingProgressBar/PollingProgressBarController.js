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
    "resetProgress" : function(cmp, event, helper) {
        cmp.set('v.eventCount',0);
	},
    "handleComponentEvent":function(cmp, event, helper) {
        //Do your custom processing here 
        //e.g. invoke an apex controller, refresh another component etc.
        var eventCount = parseInt(cmp.get('v.eventCount'));
        eventCount++;
		cmp.set('v.eventCount',eventCount);        
        console.log('c:MyComponentEvent was fired');
        if((eventCount*10) ==100){
            $A.get('e.poller:stopPolling').fire();
        }
        
	}
})