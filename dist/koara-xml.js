(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.koaraXml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/koara-xml');

},{"./lib/koara-xml":2}],2:[function(require,module,exports){
"use strict";

var used = [],
    exports = module.exports = {};

exports.XmlRenderer = require("./koara/xml/xmlrenderer");

},{"./koara/xml/xmlrenderer":3}],3:[function(require,module,exports){
"use strict";

function XmlRenderer() {
	this.out = "";
	this.level = 0;
}

XmlRenderer.prototype = {
	constructor: XmlRenderer,
	declarationTag: null,
	
	visitDocument: function(node) {
		this.out = "";
		if(this.declarationTag) {
			this.out += this.declarationTag + "\n";
		}
		if(node.children && node.children.length > 0) {
			this.out += "<document>\n";
			node.childrenAccept(this);
			this.out += "</document>";
		} else {
			this.out += "<document />";
		}
	},

	visitHeading: function(node) {
		this.level++;
		this.out += this.indent() + "<heading level=\"" + node.value + "\"";
		if(node.children && node.children.length > 0) {
			this.out += ">\n";
			this.level++;
			node.childrenAccept(this);
			this.level--;
			this.out += this.indent() + "</heading>\n";
		} else {
			this.out += " />\n";
		}
		this.level--;
	},

	visitBlockQuote: function(node) {
		this.level++;
		this.out += this.indent() + "<blockquote";
		if(node.children && node.children.length > 0) {
			this.out += ">\n";
			this.level++;
			node.childrenAccept(this);
			this.level--;
			this.out += this.indent() + "</blockquote>\n";
			this.level--;
		} else {
			this.out += " />\n";
		}
	},

	visitListBlock: function(node) {
		this.level++;
		this.out += this.indent() + "<list ordered=\"" + node.ordered + "\">\n";
		node.childrenAccept(this);
		this.out += this.indent() + "</list>\n";
		this.level--;
	},

	visitListItem: function(node) {
		this.level++;
		this.out += this.indent() + "<listitem";
		if(node.number) {
			this.out += " number=\"" + node.number + "\"";
		}
		if(node.children && node.children.length > 0) {
			this.out += ">\n";
			node.childrenAccept(this);
			this.out += this.indent() + "</listitem>\n";
		} else {
			this.out += " />\n";
		}
		this.level--;
	},

	visitCodeBlock: function(node) {
		this.level++;
		this.out += this.indent() + "<codeblock";
		if(node.language) {
			this.out += " language=\"" + node.language + "\"";
		}
		if(node.value && node.value.toString().length > 0) {
			this.out += ">";
			this.level++;
			this.out += this.escape(node.value.toString());
			this.level--;
			this.out += "</codeblock>\n";
			this.level--;
		} else {
			this.out += " />\n";
		}
	},

	visitParagraph: function(node) {
		this.level++;
		this.out += this.indent() + "<paragraph>\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</paragraph>\n";
		this.level--;
	},

	visitBlockElement: function(node) {
	},

	visitImage: function(node) {
		this.out += this.indent() + "<image url=\"" + this.escapeUrl(node.value.toString()) + "\">\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</image>\n";
	},

	visitLink: function(node) {
		this.out += this.indent() + "<link url=\"" + this.escapeUrl(node.value.toString()) + "\">\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</link>\n";
	},

	visitText: function (node) {
		this.out += this.indent() + "<text>";
		this.out += this.escape(node.value.toString());
		this.out += "</text>\n";
	},

	visitStrong: function(node) {
		this.out += this.indent() + "<strong>\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</strong>\n";
	},

	visitEm: function(node) {
		this.out += this.indent() + "<em>\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</em>\n";
	},

	visitCode: function(node) {
		this.out += this.indent() + "<code>\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</code>\n";
	},

	visitLineBreak: function(node) {
		this.out += this.indent() + "<linebreak />\n";
	},

	escapeUrl: function(text) {
        return text.replace(/ /gm, "%20").
            replace(/\"/gm, "%22").
            replace(/`/gm, "%60").
	        replace(/</gm, "%3C").
	        replace(/>/gm, "%3E").
	        replace(/\[/gm, "%5B").
	        replace(/\]/gm, "%5D").
	        replace(/\\/gm, "%5C");
	},
		
	indent: function() {
		var repeat = this.level * 2;
        var ind = "";

		for (var i = repeat - 1; i >= 0; i--) {
			ind += " ";
		}
		return ind;
	},
		
	escape: function(text) {
		return text.replace(/&/gm, "&amp;").
	        replace(/</gm, "&lt;").
	        replace(/>/gm, "&gt;").
	        replace(/\"/gm, "&quot;");
	},
		
	getOutput: function() {
		return this.out.trim();
	}
	
};

module.exports = XmlRenderer;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5keS9naXQva29hcmEva29hcmEtanMteG1sL2luZGV4LmpzIiwiL1VzZXJzL2FuZHkvZ2l0L2tvYXJhL2tvYXJhLWpzLXhtbC9saWIva29hcmEteG1sLmpzIiwiL1VzZXJzL2FuZHkvZ2l0L2tvYXJhL2tvYXJhLWpzLXhtbC9saWIva29hcmEveG1sL3htbHJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7OztBQ0EzQyxZQUFZLENBQUM7O0FBRWIsSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNiLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7QUNMekQsWUFBWSxDQUFDOztBQUViLFNBQVMsV0FBVyxHQUFHO0NBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0NBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDaEIsQ0FBQzs7QUFFRCxXQUFXLENBQUMsU0FBUyxHQUFHO0NBQ3ZCLFdBQVcsRUFBRSxXQUFXO0FBQ3pCLENBQUMsY0FBYyxFQUFFLElBQUk7O0NBRXBCLGFBQWEsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztFQUNkLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRTtHQUN2QixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0dBQ3ZDO0VBQ0QsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtHQUM3QyxJQUFJLENBQUMsR0FBRyxJQUFJLGNBQWMsQ0FBQztHQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksYUFBYSxDQUFDO0dBQzFCLE1BQU07R0FDTixJQUFJLENBQUMsR0FBRyxJQUFJLGNBQWMsQ0FBQztHQUMzQjtBQUNILEVBQUU7O0NBRUQsWUFBWSxFQUFFLFNBQVMsSUFBSSxFQUFFO0VBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0VBQ3BFLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7R0FDN0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUM7R0FDbEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxjQUFjLENBQUM7R0FDM0MsTUFBTTtHQUNOLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDO0dBQ3BCO0VBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2YsRUFBRTs7Q0FFRCxlQUFlLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDL0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDO0VBQzFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7R0FDN0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUM7R0FDbEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQztHQUM5QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYixNQUFNO0dBQ04sSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUM7R0FDcEI7QUFDSCxFQUFFOztDQUVELGNBQWMsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztFQUN4RSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQztFQUN4QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixFQUFFOztDQUVELGFBQWEsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUM7RUFDeEMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO0dBQ2YsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDOUM7RUFDRCxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0dBQzdDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDO0dBQ2xCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDO0dBQzVDLE1BQU07R0FDTixJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQztHQUNwQjtFQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLEVBQUU7O0NBRUQsY0FBYyxFQUFFLFNBQVMsSUFBSSxFQUFFO0VBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQztFQUN6QyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7R0FDakIsSUFBSSxDQUFDLEdBQUcsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7R0FDbEQ7RUFDRCxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0dBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO0dBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7R0FDL0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2IsSUFBSSxDQUFDLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQztHQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYixNQUFNO0dBQ04sSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUM7R0FDcEI7QUFDSCxFQUFFOztDQUVELGNBQWMsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUM7RUFDNUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztFQUM3QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixFQUFFOztDQUVELGlCQUFpQixFQUFFLFNBQVMsSUFBSSxFQUFFO0FBQ25DLEVBQUU7O0NBRUQsVUFBVSxFQUFFLFNBQVMsSUFBSSxFQUFFO0VBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7RUFDOUYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUM7QUFDM0MsRUFBRTs7Q0FFRCxTQUFTLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztFQUM3RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzFCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQztBQUMxQyxFQUFFOztDQUVELFNBQVMsRUFBRSxVQUFVLElBQUksRUFBRTtFQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUM7RUFDckMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztFQUMvQyxJQUFJLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQztBQUMxQixFQUFFOztDQUVELFdBQVcsRUFBRSxTQUFTLElBQUksRUFBRTtFQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUM7RUFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUM7QUFDNUMsRUFBRTs7Q0FFRCxPQUFPLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDO0VBQ3JDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2IsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBQ3hDLEVBQUU7O0NBRUQsU0FBUyxFQUFFLFNBQVMsSUFBSSxFQUFFO0VBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztFQUN2QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDYixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzFCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQztBQUMxQyxFQUFFOztDQUVELGNBQWMsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM5QixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQztBQUNoRCxFQUFFOztDQUVELFNBQVMsRUFBRSxTQUFTLElBQUksRUFBRTtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUM3QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUN0QixPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUN4QixPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUNyQixPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUNyQixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztTQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztTQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLEVBQUU7O0NBRUQsTUFBTSxFQUFFLFdBQVc7RUFDbEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDOUIsUUFBUSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7O0VBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0dBQ3JDLEdBQUcsSUFBSSxHQUFHLENBQUM7R0FDWDtFQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsRUFBRTs7Q0FFRCxNQUFNLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7U0FDNUIsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7U0FDdEIsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7U0FDdEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuQyxFQUFFOztDQUVELFNBQVMsRUFBRSxXQUFXO0VBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixFQUFFOztBQUVGLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUM3QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2tvYXJhLXhtbCcpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXNlZCA9IFtdLFxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5leHBvcnRzLlhtbFJlbmRlcmVyID0gcmVxdWlyZShcIi4va29hcmEveG1sL3htbHJlbmRlcmVyXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIFhtbFJlbmRlcmVyKCkge1xuXHR0aGlzLm91dCA9IFwiXCI7XG5cdHRoaXMubGV2ZWwgPSAwO1xufVxuXG5YbWxSZW5kZXJlci5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBYbWxSZW5kZXJlcixcblx0ZGVjbGFyYXRpb25UYWc6IG51bGwsXG5cdFxuXHR2aXNpdERvY3VtZW50OiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgPSBcIlwiO1xuXHRcdGlmKHRoaXMuZGVjbGFyYXRpb25UYWcpIHtcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuZGVjbGFyYXRpb25UYWcgKyBcIlxcblwiO1xuXHRcdH1cblx0XHRpZihub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCI8ZG9jdW1lbnQ+XFxuXCI7XG5cdFx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdFx0dGhpcy5vdXQgKz0gXCI8L2RvY3VtZW50PlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIjxkb2N1bWVudCAvPlwiO1xuXHRcdH1cblx0fSxcblxuXHR2aXNpdEhlYWRpbmc6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGhlYWRpbmcgbGV2ZWw9XFxcIlwiICsgbm9kZS52YWx1ZSArIFwiXFxcIlwiO1xuXHRcdGlmKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIj5cXG5cIjtcblx0XHRcdHRoaXMubGV2ZWwrKztcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0XHR0aGlzLmxldmVsLS07XG5cdFx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L2hlYWRpbmc+XFxuXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIC8+XFxuXCI7XG5cdFx0fVxuXHRcdHRoaXMubGV2ZWwtLTtcblx0fSxcblxuXHR2aXNpdEJsb2NrUXVvdGU6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGJsb2NrcXVvdGVcIjtcblx0XHRpZihub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCI+XFxuXCI7XG5cdFx0XHR0aGlzLmxldmVsKys7XG5cdFx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdFx0dGhpcy5sZXZlbC0tO1xuXHRcdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9ibG9ja3F1b3RlPlxcblwiO1xuXHRcdFx0dGhpcy5sZXZlbC0tO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIiAvPlxcblwiO1xuXHRcdH1cblx0fSxcblxuXHR2aXNpdExpc3RCbG9jazogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8bGlzdCBvcmRlcmVkPVxcXCJcIiArIG5vZGUub3JkZXJlZCArIFwiXFxcIj5cXG5cIjtcblx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjwvbGlzdD5cXG5cIjtcblx0XHR0aGlzLmxldmVsLS07XG5cdH0sXG5cblx0dmlzaXRMaXN0SXRlbTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8bGlzdGl0ZW1cIjtcblx0XHRpZihub2RlLm51bWJlcikge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCIgbnVtYmVyPVxcXCJcIiArIG5vZGUubnVtYmVyICsgXCJcXFwiXCI7XG5cdFx0fVxuXHRcdGlmKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIj5cXG5cIjtcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L2xpc3RpdGVtPlxcblwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIiAvPlxcblwiO1xuXHRcdH1cblx0XHR0aGlzLmxldmVsLS07XG5cdH0sXG5cblx0dmlzaXRDb2RlQmxvY2s6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGNvZGVibG9ja1wiO1xuXHRcdGlmKG5vZGUubGFuZ3VhZ2UpIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIGxhbmd1YWdlPVxcXCJcIiArIG5vZGUubGFuZ3VhZ2UgKyBcIlxcXCJcIjtcblx0XHR9XG5cdFx0aWYobm9kZS52YWx1ZSAmJiBub2RlLnZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCI+XCI7XG5cdFx0XHR0aGlzLmxldmVsKys7XG5cdFx0XHR0aGlzLm91dCArPSB0aGlzLmVzY2FwZShub2RlLnZhbHVlLnRvU3RyaW5nKCkpO1xuXHRcdFx0dGhpcy5sZXZlbC0tO1xuXHRcdFx0dGhpcy5vdXQgKz0gXCI8L2NvZGVibG9jaz5cXG5cIjtcblx0XHRcdHRoaXMubGV2ZWwtLTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCIgLz5cXG5cIjtcblx0XHR9XG5cdH0sXG5cblx0dmlzaXRQYXJhZ3JhcGg6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPHBhcmFncmFwaD5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9wYXJhZ3JhcGg+XFxuXCI7XG5cdFx0dGhpcy5sZXZlbC0tO1xuXHR9LFxuXG5cdHZpc2l0QmxvY2tFbGVtZW50OiBmdW5jdGlvbihub2RlKSB7XG5cdH0sXG5cblx0dmlzaXRJbWFnZTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxpbWFnZSB1cmw9XFxcIlwiICsgdGhpcy5lc2NhcGVVcmwobm9kZS52YWx1ZS50b1N0cmluZygpKSArIFwiXFxcIj5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9pbWFnZT5cXG5cIjtcblx0fSxcblxuXHR2aXNpdExpbms6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8bGluayB1cmw9XFxcIlwiICsgdGhpcy5lc2NhcGVVcmwobm9kZS52YWx1ZS50b1N0cmluZygpKSArIFwiXFxcIj5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9saW5rPlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0VGV4dDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8dGV4dD5cIjtcblx0XHR0aGlzLm91dCArPSB0aGlzLmVzY2FwZShub2RlLnZhbHVlLnRvU3RyaW5nKCkpO1xuXHRcdHRoaXMub3V0ICs9IFwiPC90ZXh0PlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0U3Ryb25nOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPHN0cm9uZz5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9zdHJvbmc+XFxuXCI7XG5cdH0sXG5cblx0dmlzaXRFbTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxlbT5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9lbT5cXG5cIjtcblx0fSxcblxuXHR2aXNpdENvZGU6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8Y29kZT5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9jb2RlPlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0TGluZUJyZWFrOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGxpbmVicmVhayAvPlxcblwiO1xuXHR9LFxuXG5cdGVzY2FwZVVybDogZnVuY3Rpb24odGV4dCkge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8gL2dtLCBcIiUyMFwiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoL1xcXCIvZ20sIFwiJTIyXCIpLlxuICAgICAgICAgICAgcmVwbGFjZSgvYC9nbSwgXCIlNjBcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPC9nbSwgXCIlM0NcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPi9nbSwgXCIlM0VcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvXFxbL2dtLCBcIiU1QlwiKS5cblx0ICAgICAgICByZXBsYWNlKC9cXF0vZ20sIFwiJTVEXCIpLlxuXHQgICAgICAgIHJlcGxhY2UoL1xcXFwvZ20sIFwiJTVDXCIpO1xuXHR9LFxuXHRcdFxuXHRpbmRlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByZXBlYXQgPSB0aGlzLmxldmVsICogMjtcbiAgICAgICAgdmFyIGluZCA9IFwiXCI7XG5cblx0XHRmb3IgKHZhciBpID0gcmVwZWF0IC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGluZCArPSBcIiBcIjtcblx0XHR9XG5cdFx0cmV0dXJuIGluZDtcblx0fSxcblx0XHRcblx0ZXNjYXBlOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0cmV0dXJuIHRleHQucmVwbGFjZSgvJi9nbSwgXCImYW1wO1wiKS5cblx0ICAgICAgICByZXBsYWNlKC88L2dtLCBcIiZsdDtcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPi9nbSwgXCImZ3Q7XCIpLlxuXHQgICAgICAgIHJlcGxhY2UoL1xcXCIvZ20sIFwiJnF1b3Q7XCIpO1xuXHR9LFxuXHRcdFxuXHRnZXRPdXRwdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm91dC50cmltKCk7XG5cdH1cblx0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhtbFJlbmRlcmVyO1xuXG5cbiJdfQ==
