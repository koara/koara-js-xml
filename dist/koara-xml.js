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
	
	visitDocument: function(node) {
		this.out = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
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
			this.out += ">\n";
			this.level++;
			this.out += this.escape(node.value.toString());
			this.level--;
			this.out += this.indent() + "</codeblock>\n";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5keS9naXQva29hcmEva29hcmEtanMteG1sL2luZGV4LmpzIiwiL1VzZXJzL2FuZHkvZ2l0L2tvYXJhL2tvYXJhLWpzLXhtbC9saWIva29hcmEteG1sLmpzIiwiL1VzZXJzL2FuZHkvZ2l0L2tvYXJhL2tvYXJhLWpzLXhtbC9saWIva29hcmEveG1sL3htbHJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7OztBQ0EzQyxZQUFZLENBQUM7O0FBRWIsSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNiLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7QUNMekQsWUFBWSxDQUFDOztBQUViLFNBQVMsV0FBVyxHQUFHO0NBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0NBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDaEIsQ0FBQzs7QUFFRCxXQUFXLENBQUMsU0FBUyxHQUFHO0FBQ3hCLENBQUMsV0FBVyxFQUFFLFdBQVc7O0NBRXhCLGFBQWEsRUFBRSxTQUFTLElBQUksRUFBRTtFQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhDQUE4QyxDQUFDO0VBQzFELEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7R0FDN0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxjQUFjLENBQUM7R0FDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLGFBQWEsQ0FBQztHQUMxQixNQUFNO0dBQ04sSUFB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QixPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztTQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLEVBQUU7O0NBRUQsU0FBUyxFQUFFLFdBQVc7RUFDckIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pCLEVBQUU7O0FBRUYsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0FBQzdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIva29hcmEteG1sJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB1c2VkID0gW10sXG4gICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmV4cG9ydHMuWG1sUmVuZGVyZXIgPSByZXF1aXJlKFwiLi9rb2FyYS94bWwveG1scmVuZGVyZXJcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gWG1sUmVuZGVyZXIoKSB7XG5cdHRoaXMub3V0ID0gXCJcIjtcblx0dGhpcy5sZXZlbCA9IDA7XG59XG5cblhtbFJlbmRlcmVyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IFhtbFJlbmRlcmVyLFxuXHRcblx0dmlzaXREb2N1bWVudDogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcblwiO1xuXHRcdGlmKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIjxkb2N1bWVudD5cXG5cIjtcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0XHR0aGlzLm91dCArPSBcIjwvZG9jdW1lbnQ+XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiPGRvY3VtZW50IC8+XCI7XG5cdFx0fVxuXHR9LFxuXG5cdHZpc2l0SGVhZGluZzogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8aGVhZGluZyBsZXZlbD1cXFwiXCIgKyBub2RlLnZhbHVlICsgXCJcXFwiXCI7XG5cdFx0aWYobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiPlxcblwiO1xuXHRcdFx0dGhpcy5sZXZlbCsrO1xuXHRcdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHRcdHRoaXMubGV2ZWwtLTtcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjwvaGVhZGluZz5cXG5cIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCIgLz5cXG5cIjtcblx0XHR9XG5cdFx0dGhpcy5sZXZlbC0tO1xuXHR9LFxuXG5cdHZpc2l0QmxvY2tRdW90ZTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8YmxvY2txdW90ZVwiO1xuXHRcdGlmKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIj5cXG5cIjtcblx0XHRcdHRoaXMubGV2ZWwrKztcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0XHR0aGlzLmxldmVsLS07XG5cdFx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L2Jsb2NrcXVvdGU+XFxuXCI7XG5cdFx0XHR0aGlzLmxldmVsLS07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIC8+XFxuXCI7XG5cdFx0fVxuXHR9LFxuXG5cdHZpc2l0TGlzdEJsb2NrOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5sZXZlbCsrO1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxsaXN0IG9yZGVyZWQ9XFxcIlwiICsgbm9kZS5vcmRlcmVkICsgXCJcXFwiPlxcblwiO1xuXHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9saXN0PlxcblwiO1xuXHRcdHRoaXMubGV2ZWwtLTtcblx0fSxcblxuXHR2aXNpdExpc3RJdGVtOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5sZXZlbCsrO1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxsaXN0aXRlbVwiO1xuXHRcdGlmKG5vZGUubnVtYmVyKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIiBudW1iZXI9XFxcIlwiICsgbm9kZS5udW1iZXIgKyBcIlxcXCJcIjtcblx0XHR9XG5cdFx0aWYobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiPlxcblwiO1xuXHRcdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjwvbGlzdGl0ZW0+XFxuXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIC8+XFxuXCI7XG5cdFx0fVxuXHRcdHRoaXMubGV2ZWwtLTtcblx0fSxcblxuXHR2aXNpdENvZGVCbG9jazogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8Y29kZWJsb2NrXCI7XG5cdFx0aWYobm9kZS5sYW5ndWFnZSkge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCIgbGFuZ3VhZ2U9XFxcIlwiICsgbm9kZS5sYW5ndWFnZSArIFwiXFxcIlwiO1xuXHRcdH1cblx0XHRpZihub2RlLnZhbHVlICYmIG5vZGUudmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLm91dCArPSBcIj5cXG5cIjtcblx0XHRcdHRoaXMubGV2ZWwrKztcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuZXNjYXBlKG5vZGUudmFsdWUudG9TdHJpbmcoKSk7XG5cdFx0XHR0aGlzLmxldmVsLS07XG5cdFx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L2NvZGVibG9jaz5cXG5cIjtcblx0XHRcdHRoaXMubGV2ZWwtLTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vdXQgKz0gXCIgLz5cXG5cIjtcblx0XHR9XG5cdH0sXG5cblx0dmlzaXRQYXJhZ3JhcGg6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPHBhcmFncmFwaD5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9wYXJhZ3JhcGg+XFxuXCI7XG5cdFx0dGhpcy5sZXZlbC0tO1xuXHR9LFxuXG5cdHZpc2l0QmxvY2tFbGVtZW50OiBmdW5jdGlvbihub2RlKSB7XG5cdH0sXG5cblx0dmlzaXRJbWFnZTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxpbWFnZSB1cmw9XFxcIlwiICsgdGhpcy5lc2NhcGVVcmwobm9kZS52YWx1ZS50b1N0cmluZygpKSArIFwiXFxcIj5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9pbWFnZT5cXG5cIjtcblx0fSxcblxuXHR2aXNpdExpbms6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8bGluayB1cmw9XFxcIlwiICsgdGhpcy5lc2NhcGVVcmwobm9kZS52YWx1ZS50b1N0cmluZygpKSArIFwiXFxcIj5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9saW5rPlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0VGV4dDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8dGV4dD5cIjtcblx0XHR0aGlzLm91dCArPSB0aGlzLmVzY2FwZShub2RlLnZhbHVlLnRvU3RyaW5nKCkpO1xuXHRcdHRoaXMub3V0ICs9IFwiPC90ZXh0PlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0U3Ryb25nOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPHN0cm9uZz5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9zdHJvbmc+XFxuXCI7XG5cdH0sXG5cblx0dmlzaXRFbTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxlbT5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9lbT5cXG5cIjtcblx0fSxcblxuXHR2aXNpdENvZGU6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8Y29kZT5cXG5cIjtcblx0XHR0aGlzLmxldmVsKys7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLmxldmVsLS07XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPC9jb2RlPlxcblwiO1xuXHR9LFxuXG5cdHZpc2l0TGluZUJyZWFrOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGxpbmVicmVhayAvPlxcblwiO1xuXHR9LFxuXG5cdGVzY2FwZVVybDogZnVuY3Rpb24odGV4dCkge1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8gL2dtLCBcIiUyMFwiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoL1xcXCIvZ20sIFwiJTIyXCIpLlxuICAgICAgICAgICAgcmVwbGFjZSgvYC9nbSwgXCIlNjBcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPC9nbSwgXCIlM0NcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPi9nbSwgXCIlM0VcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvXFxbL2dtLCBcIiU1QlwiKS5cblx0ICAgICAgICByZXBsYWNlKC9cXF0vZ20sIFwiJTVEXCIpLlxuXHQgICAgICAgIHJlcGxhY2UoL1xcXFwvZ20sIFwiJTVDXCIpO1xuXHR9LFxuXHRcdFxuXHRpbmRlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByZXBlYXQgPSB0aGlzLmxldmVsICogMjtcbiAgICAgICAgdmFyIGluZCA9IFwiXCI7XG5cblx0XHRmb3IgKHZhciBpID0gcmVwZWF0IC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGluZCArPSBcIiBcIjtcblx0XHR9XG5cdFx0cmV0dXJuIGluZDtcblx0fSxcblx0XHRcblx0ZXNjYXBlOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0cmV0dXJuIHRleHQucmVwbGFjZSgvJi9nbSwgXCImYW1wO1wiKS5cblx0ICAgICAgICByZXBsYWNlKC88L2dtLCBcIiZsdDtcIikuXG5cdCAgICAgICAgcmVwbGFjZSgvPi9nbSwgXCImZ3Q7XCIpLlxuXHQgICAgICAgIHJlcGxhY2UoL1xcXCIvZ20sIFwiJnF1b3Q7XCIpO1xuXHR9LFxuXHRcdFxuXHRnZXRPdXRwdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm91dC50cmltKCk7XG5cdH1cblx0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhtbFJlbmRlcmVyO1xuXG5cbiJdfQ==