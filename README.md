[![Koara](http://www.koara.io/logo.png)](http://www.koara.io)

[![Build Status](https://img.shields.io/travis/koara/koara-js-xml.svg)](https://travis-ci.org/koara/koara-js-xml)
[![Coverage Status](https://img.shields.io/coveralls/koara/koara-js-xml.svg)](https://coveralls.io/github/koara/koara-js-xml?branch=master)
[![Latest Version](https://img.shields.io/npm/v/koara-xml.svg?maxAge=2592000)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koara/koara-js-xml/blob/master/LICENSE)

# Koara-js-xml
[Koara](http://www.koara.io) is a modular lightweight markup language. This project can render the koara AST to Xml in Javascript.  
The AST is created by the [core koara parser](https://github.com/koara/koara-js).

## Getting started
- Download [ZIP file](https://github.com/koara/koara-js-xml/archive/0.12.0.zip)
- Npm

  ```bash
  npm install koara-xml --save-dev
  ```
  
- Bower

  ```xml
  bower install koara-xml
  ```

## Usage
- Node

  ```js
  var koara = require('koara');
  var koaraXml = require('koara-xml');

  var parser = new koara.Parser();
  var result = parser.parse("Hello World!");
  var renderer = new koaraXml.XmlRenderer();
  result.accept(renderer);
  console.log(renderer.getOutput());
  ```
  
- Browser
  
  ```js
  <!doctype html>
  <html>
    <body>
      <script type="text/javascript" src="koara.min.js"></script>
      <script type="text/javascript" src="koara-xml.min.js"></script>
      <script type="text/javascript">
        var parser = new koara.Parser();
        var result = parser.parse("Hello World!");
        var renderer = new koaraXml.XmlRenderer();
        result.accept(renderer);
        document.write(renderer.getOutput());
      </script>
    </body>
  </html>
  ```

## Configuration
You can configure the Renderer:
-  **renderer.hardWrap**  
   Default:	`false`
   
   Specify if newlines should be hard-wrapped (return-based linebreaks) by default.

-  **renderer.declarationTag**  
   Default:	`null`
   
   Add an XML Declaration Tag add the top of the generated output.  