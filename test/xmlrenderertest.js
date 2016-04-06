'use strict';

var koara = require('koara');
var koaraXml = require('../lib/koara-xml');

describe("XmlRendererTest", function() {
	var renderer;
	var document;

	beforeEach(function() {
		var parser = new koara.Parser();
		this.document = parser.parse("Test");
		this.renderer = new koaraXml.XmlRenderer();
	});

	it("Test Basic", function() {
		var expected = "<document>\n";
		expected += "  <paragraph>\n";
		expected += "    <text>Test</text>\n";
		expected += "  </paragraph>\n";
		expected += "</document>";
		
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual(expected);
	});
	
	it("Test Add DeclarationTag", function() {
		var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		expected += "<document>\n";
		expected += "  <paragraph>\n";
		expected += "    <text>Test</text>\n";
		expected += "  </paragraph>\n";
		expected += "</document>";
		
		this.renderer.declarationTag = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual(expected);		
	});
	
});