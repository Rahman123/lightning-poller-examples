## Lightning Poller Component

LightningPoller is a generic polling component that is available on the AppExchange (currently under security review). If you need a link to the managed contact me at anarasimhan@salesforce.com .

This repository is for illustrating how to use that component with a couple of simple examples. Pleaes contribute more examples and/or issues.

The polling component leverages Lightning Events to drive the polling behaviour. 

### Using this component

###  Starting and Stopping Polling

In order to start polling, you fire off a `e.poller:startPolling` event. This event takes two parameters:

- `eventToFire` : This is the name of the event that you would like to have the component fire as a means to call back. __Note__ : You will have to create this event. Make sure this event is of type `APPLICATION` and does not have any event attrbutes.
- `pollInterval` : This is the sleep time in seconds that the polling component will wait before it fires off and event as defined by the `eventToFire`

#### Sample Event 

```
<!-- c:MyComponentEvent: NO ATTRIBUTES -->
<aura:event type="__APPLICATION__" description="A component level event that will be fired by the poller" />

```

#### Saple code to start polling:

```
var startPollEvent = $A.get('e.poller:startPolling');
        console.log(startPollEvent);
        startPollEvent.setParams({
            "eventToFire":"c:MyComponentEvent",
            "pollInterval":3 //this is seconds not milliseconds
        });
        startPollEvent.fire();
```


In order to stop polling, you fire the `e.poller:stopPolling` event with no additional paramters. Sample code to stop the polling process is below:

```
    var stopPollEvent = $A.get('e.poller:stopPolling');
    stopPollEvent.fire();
```

## Example Lightning Components

### SimplePollerExample

We'll create a simple component that has a button that will start the pooling and a button to stop the polling. 

```
<aura:component >
    <aura:attribute name="eventCount" type="Integer" default="0"/> 
    <aura:attribute name="eventMessages" type="String[]"/> 
<lightning:button label="Start polling" onclick="{!c.startPolling}" />
    <lightning:button label="Stop polling" onclick="{!c.stopPolling}" /><br/>
    <aura:handler event="c:MyComponentEvent" action="{!c.handleComponentEvent}"/>
    <aura:iteration items="{!v.eventMessages}" var="msg">
        {!msg}<br/>
    </aura:iteration>
</aura:component>

```

Key things this component does:

1. Register an event handler for the “c:MyComponentEvent”  that will be fired from the poller component.
2. Provide a couple of buttons and controller methods to start/stop polling. 

Let's look at the controller for this component:

```
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
        console.log('c:MyComponentEvent was fired');
        
    }
})
```

Note: `poller` in the above code is the namespace for my AppExchange managed component. 


### Polling Progress Bar

This component simulates a progress bar from 0 to 100%. It simply increments a counter to calculate the % value. 

Component markup & controller are below:

#### PollingProgressBar.cmp
```
<aura:component implements="force:appHostable,flexipage:availableForAllPageTypes,flexipage:availableForRecordHome,force:hasRecordId" access="global">
    <aura:attribute name="eventCount" type="Integer" default="0"/> 
    <lightning:button label="Start progress" onclick="{!c.startPolling}" />
    <lightning:button label="Reset Progress" onclick="{!c.resetProgress}" /><br/>
    <aura:handler event="c:MyComponentEvent" action="{!c.handleComponentEvent}"/>
    <div class="slds-progress-bar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{!(v.eventCount * 10 )}" role="progressbar">
        Progress: {!v.eventCount*10} %
        <span class="slds-progress-bar__value" style="{!'width: '+ (v.eventCount * 10 )+'%;'}">
            <span class="slds-assistive-text">Progress: {!v.eventCount*10}%</span>
        </span>
    </div>
</aura:component>
```
#### PollingProgressBarController.js

```
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
```