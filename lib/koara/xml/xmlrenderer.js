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
			this.out += " language=\"" + this.escape(node.language) + "\"";
		}
		if(node.value && node.value.toString().length > 0) {
			this.out += ">";
			this.level++;
			this.out += this.escape(node.value.toString());
			this.level--;
			this.out += "</codeblock>\n";
		} else {
			this.out += " />\n";
		}
		this.level--;
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
		var hard = this.hardWrap || node.explicit;
		this.out += this.indent() + "<linebreak explicit=\"" + hard + "\"/>\n";
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


