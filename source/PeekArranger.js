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
