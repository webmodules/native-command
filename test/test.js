
var assert = require('assert');
var NativeCommand = require('../');


describe('NativeCommand', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  describe('"bold" command', function () {

    it('should create a "bold" command', function () {
      var bold = new NativeCommand('bold');

      assert(bold instanceof NativeCommand);
      assert(bold.name === 'bold');
      assert(bold.document === document);
    });

    describe('execute()', function () {

      it('should insert a B element around selection', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var bold = new NativeCommand('bold');
        bold.execute();

        assert('h<b>el</b>lo <b>world!</b>' === div.innerHTML);
      });

    });

    describe('queryState()', function () {

      it('should return `false` for regular text', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var bold = new NativeCommand('bold');
        assert(false === bold.queryState());
      });

      it('should return `true` when within a B element', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.childNodes[1].firstChild, 1);
        range.setEnd(div.childNodes[1].firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var bold = new NativeCommand('bold');
        assert(true === bold.queryState());
      });

    });

    describe('queryEnabled()', function () {

      it('should return `false` when there\'s no selection', function () {
        // at least 1 contenteditable needs to be in the <body>
        // otherwise Firefox throws an error on `queryEnabled()`
        div = document.createElement('div');
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection to nothing
        var sel = window.getSelection();
        sel.removeAllRanges();

        var bold = new NativeCommand('bold');

        assert(false === bold.queryEnabled());
      });

      it('should return `true` when there\'s a valid selection', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var bold = new NativeCommand('bold');
        assert(true === bold.queryEnabled());
      });
    });

  });

});
