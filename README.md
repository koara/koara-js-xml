[![Koara](http://www.koara.io/logo.png)](http://www.koara.io)

[![Build Status](https://img.shields.io/travis/koara/koara-js-xml.svg)](https://travis-ci.org/koara/koara-js-xml)
[![Coverage Status](https://img.shields.io/coveralls/koara/koara-js-xml.svg)](https://coveralls.io/github/koara/koara-js-xml?branch=master)
[![Latest Version](https://img.shields.io/npm/v/koara-xml.svg)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koara/koara-java-xml/blob/master/LICENSE)

# koara-js-xml
[Koara](http://www.koara.io) is a modular lightweight markup language. This project is for parsing Koara to Xml.

## Getting Started
- Via Npm:

  ```bash
  npm install koara-xml --save-dev
  ```
  
## Usage

Node:

```javascript
var koara = require('koara');
var koaraHtml = require('koara-xml');

var parser = new koara.Parser();

//Enable which modules to parse (all are parsed by default)
parser.modules = ['paragraphs', 'headings', 'lists', 'links', 'images', 'formatting', 'blockquotes', 'code'];

//Parse string or file and generate AST
var document = parser.parse('Hello World!'); 

//Render as Xml
var renderer = new koaraHtml.XmlRenderer();
document.accept(renderer);

console.log(renderer.getOutput());
```

Browser:

```javascript
<html>
  <body>
    <script src="koara.js"></script>
    <script src="koara-xml.js"></script>     
    <script>
        var parser = new koara.Parser();
        
        //Enable which modules to parse (all are parsed by default)
        parser.modules = ['paragraphs', 'headings', 'lists', 'links', 'images', 'formatting', 'blockquotes', 'code'];

        //Parse string or file and generate AST
        var doc = parser.parse('Hello World!');
        
        //Render as Xml
        var renderer = new koaraXml.XmlRenderer();
        doc.accept(renderer);  
        
        console.log(renderer.getOutput());
     </script>
  </body>
</html>
```