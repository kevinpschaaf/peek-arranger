enyo.kind({
	name:"enyo.EventRecorder",
	kind:"enyo.Control",
	handlers: {
		onmove:"cursorMove",
		ondown:"cursorDown",
		onup:"cursorUp"
	},
	published: {
		recording:false,
		paused:false,
		playing:false,
		showCursor:true,
		src:"",
	},
	recordedEvents: [],
	captureEvents: {"down":1,"up":1,"move":1,"enter":1,"leave":1,"mousewheel":1},
	components: [
		{name:"controls", kind:"EventRecorderControls", showing:true, onRecord:"record", onPlay:"play", onPause:"pause", onStop:"stop", onData:"showData"},
		{name:"hover", style:"position:absolute; z-index:9999; background:orange; opacity:0.5; height:20px; width:20px; border-radius:10px; margin:-10px;", showing:false},
		{name:"data", kind:"EventRecorderData", onSaveData:"parseData"}
	],
	create:function() {
		this.inherited(arguments);
		this.showCursorChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.resizeHandler();
		this.srcChanged();
	},
	srcChanged: function() {
		if (this.src) {
			new enyo.Ajax({url: this.src})
			.response(this, function(inSender, inResponse) {
				this.saveData(inResponse);
			})
			.go();
		}
	},
	dispatchEvent: function(inEventName, inEvent, inSender) {
		if (this.recording && !this.paused && this.captureEvents[inEvent.type]) {
			var t = enyo.now() - this.startTime;
			inEvent._recordedEvent = true;
			this.recordedEvents.push({time:t, event:inEvent});
			this.$.controls.setInfo("Recording: " + this.recordedEvents.length);
		}
		return this.inherited(arguments);
	},
	showCursorChanged: function() {
		this.$.hover.setShowing(this.playing && this.showCursor);
	},
	recordingChanged: function() {
		if (this.recording) {
			this.startTime = enyo.now();
			this.setPlaying(false);
			this.recordedEvents = [];
		}
	},
	playingChanged: function() {
		this.showCursorChanged();
		if (this.playing) {
			this.setRecording(false);
			this.playbackIdx = 0;
			this.nextOffset = 0;
			this.nextEvent();
		}
	},
	pausedChanged: function() {
		if (!this.paused) {
			this.pausedTime = enyo.now();
		} else {
			this.startTime += (enyo.now() - this.pausedTime)
		}
	},
	play: function() {
		if (this.paused) {
			this.setPaused(false);
		} else {
			this.setPlaying(true);
		}
	},
	pause: function() {
		this.setPaused(true);
	},
	record: function() {
		this.setRecording(true);
	},
	stop: function() {
		this.setRecording(false);
		this.setPlaying(false);
		this.setPaused(false);
		this.$.controls.setInfo("Stopped: " + this.recordedEvents.length);
	},
	nextEvent: function() {
		if (!this.playing || this.paused) {
			return;
		}
		var e;
		while ((e = this.recordedEvents[this.playbackIdx]) && (e.time == this.nextOffset)) {
			enyo.dispatcher.dispatch(e.event);
			this.playbackIdx++;
		}
		this.$.controls.setInfo("Playing: " + this.playbackIdx + " / " + this.recordedEvents.length);
		if (e) {
			var delay = e.time - this.nextOffset;
			this.nextOffset = e.time;
			this.job = setTimeout(enyo.bind(this, this.nextEvent), delay);
		} else {
			this.setPlaying(false);
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		this.recorderBounds = this.getBounds();
	},
	cursorMove: function(inSender, inEvent) {
		if (inEvent._recordedEvent) {
			var y = inEvent.clientY - this.recorderBounds.top;
			var x = inEvent.clientX - this.recorderBounds.left;
			this.$.hover.setBounds({top: y, left: x});
		}
	},
	cursorDown: function(inSender, inEvent) {
		if (inEvent._recordedEvent) {
			this.$.hover.applyStyle("background","red");
		}
	},
	cursorUp: function(inSender, inEvent) {
		if (inEvent._recordedEvent) {
			this.$.hover.applyStyle("background","orange");
		}
	},
	showData: function() {
		this.$.data.setData(this.recordedEvents);
		this.$.data.show();
	},
	parseData: function(inSender, inEvent) {
		this.saveData(enyo.json.parse(inEvent.data));
	},
	saveData: function(data) {
		for (var i in data) {
			e = data[i];
			for (var j in e.event) {
				if (j == "target") {
					e.event.target = enyo.dom.byId(e.event.target);
				}
			}
			e.event.preventDefault = enyo.gesture.preventDefault;
		}
		this.recordedEvents = data;
		this.$.controls.setInfo("Stopped: " + this.recordedEvents.length);
	}
});

enyo.kind({
	name:"enyo.EventRecorderControls",
	kind:"onyx.Popup",
	modal:false,
	autoDismiss:false,
	events: {
		onPlay:"",
		onPause:"",
		onStop:"",
		onRecord:"",
		onData:""
	},
	published: {
		info:"",
		canRecord:true,
		canPlay:true,
		canStop:true
	},
	components: [
		{kind:"FittableColumns", style:"color:white; padding-bottom:5px;", ondrag:"drag", components: [
			{content:"Event Recorder"},
			{fit:true, name:"info", style:"text-align:right;"} 
		]},
		{name:"play", kind:"onyx.Button", content:"Play", ontap:"doPlay"},
		{name:"record", kind:"onyx.Button", content:"Record", ontap:"doRecord"},
		{name:"pause", kind:"onyx.Button", content:"Pause", ontap:"doPause"},
		{name:"stop", kind:"onyx.Button", content:"Stop", ontap:"doStop"},
		{name:"showData", kind:"onyx.Button", content:"Data", ontap:"doData"}
	],
	drag: function(inSender, inEvent) {
		this.setBounds({top:inEvent.clientY, left:inEvent.clientX});
	},
	infoChanged: function() {
		this.$.info.setContent(this.info);
	},
	dataChanged: function() {
		this.$.data.setValue(this.data);
	},
});

enyo.kind({
	name:"EventRecorderData",
	kind:"onyx.Popup", 
	layoutKind:"FittableRowsLayout", 
	style:"position:absolute; z-index:9999; top:15px; left:15px; right:15px; bottom:15px;",
	published: {
		data:""
	},
	events: {
		onSaveData:""
	},
	components: [
		{content:"Event Data", style:"padding-bottom:5px;"},
		{name:"data", fit:true, kind:"TextArea", style:"width:100%"},
		{style:"text-align:right;", components: [
			{name:"save", kind:"onyx.Button", content:"Save", ontap:"saveData"},
			{name:"close", kind:"onyx.Button", content:"Close", ontap:"hide"}
		]}
	],
	dataChanged: function() {
		var d = [];
		for (var i in this.data) {
			var e = this.data[i];
			var n = {};
			for (var j in e.event) {
				if (typeof e.event[j] != "object") {
					n[j] = e.event[j];
				} else if (j == "target") {
					n[j] = e.event[j].id;
				}
			}
			d.push({time:e.time, event:n});
		}
		this.$.data.setValue(enyo.json.stringify(d));
	},
	saveData: function() {
		this.doSaveData({data:this.$.data.getValue()});
		this.hide();
	}
});