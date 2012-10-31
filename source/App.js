enyo.kind({
	name: "App",
	fit: true,
	classes:"onyx",
	style:"background:url(assets/splash.png); background-size:cover;",
	handlers: {
		onNext:"next",
		onPrev:"prev",
	},
	components:[
		//{kind:"EventRecorder", name:"recorder", src:"assets/events.json", components: [
			{kind:"Panels", index:0, draggable:false, classes:"enyo-fit panels-shadow", arrangerKind:"PeekArranger", components: [
				{kind:"CategoryListPanel", peekWidth:180, style:"width:280px;"},
				{kind:"AppListPanel", peekWidth:86},
				{kind:"AppDetailPanel", peekWidth:100},
				{kind:"GenericPanel", peekWidth:100, components: [{content:"3"}]},
				{kind:"GenericPanel", peekWidth:100, components: [{content:"4"}]},
				{kind:"GenericPanel", peekWidth:100, components: [{content:"5"}]},
				{kind:"GenericPanel", peekWidth:100, components: [{content:"6"}]}
			]}
		//]}
	],
	create: function() {
		this.inherited(arguments);
		window.panels = this.$.panels;
		this.$.panels.getAnimator().setDuration(800);
	},
	next: function() {
		this.$.panels.next();
	},
	prev: function() {
		this.$.panels.previous();
	}
});

enyo.kind({
	name:"CategoryListPanel",
	kind:"FittableRows",
	events: {
		onNext:"",
		onPrev:""
	},
	components: [
		{kind:"List", touch:true, fit:true, style:"background:white;", onSetupItem:"setupItem", components: [
			{name:"item", kind:"onyx.Item", ontap:"doNext", components: [
				{style:"display:inline-block; border:1px solid white; margin-right:10px; width:20px; height:20px; margin-bottom:-4px;"},
				{style:"display:inline-block; color:white;", name:"category"}
			]}
		]},
		{kind:"PanelDragDecorator", components: [
			{kind:"onyx.Toolbar", components: [
				{kind:"onyx.Grabber", ontap:"doPrev"}
			]}
		]}
	],
	data: ["Bookmarked Apps", "All Apps", "Books", "Business", "Education", "Entertainment", "Finance", "Food", "Games", "Health & Fitness", "Lifestyle", "Music", "Navigation", "News", "Photography", "Productivity Information"],
	create: function() {
		this.inherited(arguments);
		this.$.list.setCount(this.data.length);
	},
	setupItem: function(inSender, inEvent) {
		this.$.category.setContent(this.data[inEvent.index]);
		this.$.item.applyStyle("background-color", (inEvent.index % 2) ? "#888" : "#777");
	}
});

enyo.kind({
	name:"AppListPanel",
	kind:"FittableRows", 
	events: {
		onNext:"",
		onPrev:""
	},
	components: [
		{kind:"onyx.Toolbar", components: [
			{kind:"onyx.InputDecorator", style:"width:100%; height:30px; border-radius:15px;", components: [
				{kind:"onyx.Input", placeholder:"Search in All Apps"},
				{kind:"Image", src:"assets/search.png", style:"float:right; margin:4px;"}
			]}
		]},
		{kind:"List", touch:true, fit:true, style:"background:white;", onSetupItem:"setupItem", components: [
			{name:"item", kind:"onyx.Item", ontap:"doNext", components: [
				{style:"display:inline-block; border:1px solid black; margin-right:10px; width:60px; height:60px; margin-bottom:-8px;"},
				{style:"display:inline-block; height:60px;", components: [
					{name:"name", tag:"b"},
					{name:"by", style:"font-size:12px;"},
					{name:"rating", style:"font-size:12px;", allowHtml:true, content:"&#9733;&#9733;&#9733;&#9733;&#9733; (123)"}
				]},
				{style:"display:inline-block; float:right; margin-top:35px;", components: [
					{kind:"onyx.Button", content:"&#8226;", allowHtml:true, style:"font-size:14px; border-top-right-radius:0; border-bottom-right-radius:0"},
					{kind:"onyx.Button", content:"Buy $400.00", style:"font-size:14px; border-top-left-radius:0; border-bottom-left-radius:0; border-left:0px;"}
				]}
			]}
		]},
		{kind:"PanelDragDecorator", components: [
			{kind:"onyx.Toolbar", components: [
				{kind:"onyx.Grabber", ontap:"doPrev"}
			]}
		]}
	],
	data: ["Bookmarked Apps", "All Apps", "Books", "Business", "Education", "Entertainment", "Finance", "Food", "Games", "Health & Fitness", "Lifestyle", "Music", "Navigation", "News", "Photography", "Productivity Information"],
	create: function() {
		this.inherited(arguments);
		this.$.list.setCount(this.data.length);
	},
	setupItem: function(inSender, inEvent) {
		this.$.name.setContent(this.data[inEvent.index]);
		this.$.by.setContent("by " + this.data[inEvent.index]);
		this.$.item.applyStyle("background-color", (inEvent.index % 2) ? "#FFF" : "#DDD");
	}
});

enyo.kind({
	name:"AppDetailPanel",
	kind:"FittableRows", 
	classes:"onyx",
	events: {
		onNext:"",
		onPrev:""
	},
	components: [
		{kind:"FittableRows", style:"padding:20px;", fit:true, components: [
			{style:"padding-bottom:20px;", components: [
				{style:"display:inline-block; border:1px solid black; margin-right:10px; width:60px; height:60px; margin-bottom:-8px;"},
				{style:"display:inline-block; height:60px;", components: [
					{name:"name", tag:"b", content:"Running with Scissors"},
					{name:"by", style:"font-size:12px;", content:"by Developer"},
					{name:"rating", style:"font-size:12px;", allowHtml:true, content:"&#9733;&#9733;&#9733;&#9733;&#9733; (123)"}
				]},
				{style:"float:right; margin-top:35px;", classes:"hide-narrow", components: [
					{kind:"onyx.Button", content:"&#8226;", allowHtml:true, style:"font-size:14px; border-top-right-radius:0; border-bottom-right-radius:0"},
					{kind:"onyx.Button", content:"Buy $400.00", style:"font-size:14px; border-top-left-radius:0; border-bottom-left-radius:0; border-left:0px;"}
				]}
			]},
			{kind:"Scroller", fit:true, components: [
				{kind:"Panels", arrangerKind:"CarouselArranger", style:"height:200px;width:100%;", components: [
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"},
					{style:"border:10px solid white; padding:10px; width:150px;"}
				]},
				{kind:"FittableColumns", style:"padding-top:20px;", components: [
					{tag:"b", style:"font-size:14px;", allowHtml:true, content:"Average Rating: &#9733;&#9733;"},
					{tag:"span", style:"font-size:14px; color:gray;", allowHtml:true, content:"&#9733;&#9733;&#9733;", fit:true},
					{tag:"span", style:"font-size:12px; color:gray;", content:"(Based on 973 ratings)"}
				]},
				{kind:"FittableColumns", style:"padding-bottom:10px;", components: [
					{style:"background:green; font-size:12px; text-align:center; color:white; width:20%", content:"20%"},
					{style:"background:red; font-size:12px; text-align:center; color:white;", content:"20%", fit:true}
				]},
				{style:"; font-size:12px;", content:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"}
			]}
		]},
		{kind:"PanelDragDecorator", components: [
			{kind:"onyx.Toolbar", components: [
				{kind:"onyx.Grabber", ontap:"doPrev"}
			]}
		]}
	]
});

enyo.kind({
	name: "PeekArranger",
	kind: "CarouselArranger",
	//* @protected
	size: function() {
		this.inherited(arguments);
	},
	arrange: function(inC, inIndex) {
		var c$ = this.container.getPanels();
		for (var i=0, c; (c=c$[i]); i++) {
			var lpad = this.containerPadding.left;
			var width = this.containerBounds.width;
			if (inIndex == 0) {
				if (i == 0) {
					// Right-aligned
					left = width-c.width;
				} else {
					// Off-screen
					left = width;
				}
			} else {
				if (i < inIndex) {
					// Left aligned
					left = lpad;
				} else if ((i == inIndex) && !enyo.Panels.isScreenNarrow()) {
					// Left with peek
					left = lpad + c$[i-1].peekWidth;
				} else {
					// Off-screen
					left = width;
				}
			}
			this.arrangeControl(c, {left: left});
		}
	},
	calcArrangementDifference: function(inI0, inA0, inI1, inA1) {
		var diff = Math.abs(inA1[inI0].left - inA0[inI0].left);
		return diff;
	},
	flowControl: function(inControl, inA) {
		this.inherited(arguments);
		if (this.container.realtimeFit) {
			var c$ = this.container.getPanels();
			var fit = c$[this.container.index];
			if (inControl == fit && this.container.index > 0) {
				this.fitControl(inControl, inA.left);
			}
		}
		
	},
	finish: function() {
		this.inherited(arguments);
		if (!this.container.realtimeFit && this.containerBounds) {
			var c$ = this.container.getPanels();
			var a$ = this.container.arrangement;
			var i = this.container.index;
			var curr = c$[i];
			var next = c$[i+1];
			this.fitControl(curr, this.containerBounds.width - a$[i].left);
			if (next) {
				this.fitControl(next, this.containerBounds.width - c$[i].peekWidth);
			}
		}
	},
	fitControl: function(inControl, inWidth) {
		inControl.applyStyle("width", inWidth + "px");
		inControl.resized();
	}
});

enyo.kind({
	name:"GenericPanel",
	kind:"FittableRows", 
	components: [
		{fit:true, style:"background:white; padding:20px;", name:"client"},
		{kind:"PanelDragDecorator", components: [
			{kind:"onyx.Toolbar", components: [
				{kind:"onyx.Grabber"}
			]}
		]}
	]
});
