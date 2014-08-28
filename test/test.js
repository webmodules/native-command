
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

    describe('execute(range: Range)', function () {

      it('should insert a B element around given `range`', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set range start and end
        var range = document.createRange();
        range.setStart(div.firstChild, 0);
        range.setEnd(div.firstChild, 2);

        // set the current selection to somewhere else completely
        var sel = window.getSelection();
        sel.removeAllRanges();
        var boldText = div.childNodes[1].firstChild;
        var r2 = document.createRange();
        r2.setStart(boldText, 1);
        r2.setEnd(boldText, 3);
        sel.addRange(r2);

        var bold = new NativeCommand('bold');
        bold.execute(range);

        assert('<b>he</b>llo <b>world!</b>' === div.innerHTML);

        // test that the current selection is still intact
        assert(sel.rangeCount === 1);
        assert(sel.getRangeAt(0).startContainer === boldText);
        assert(sel.getRangeAt(0).startOffset === 1);
        assert(sel.getRangeAt(0).endContainer === boldText);
        assert(sel.getRangeAt(0).endOffset === 3);
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

  describe('"createLink" command', function () {

    it('should create a "createLink" command', function () {
      var createLink = new NativeCommand('createLink');

      assert(createLink instanceof NativeCommand);
      assert(createLink.name === 'createLink');
      assert(createLink.document === document);
    });

    describe('execute(link: string)', function () {

      it('should insert an A element around selection', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.childNodes[1].firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var createLink = new NativeCommand('createLink');

        createLink.execute('http://example.com/foo.html');
        assert('h<a href="http://example.com/foo.html">ello </a><b><a href="http://example.com/foo.html">wor</a>ld!</b>' === div.innerHTML);
      });

    });

    describe('execute(range: Range, link: string)', function () {

      it('should insert an A element around given `range`', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set Range start and end
        var range = document.createRange();
        range.setStart(div.firstChild, 0);
        range.setEnd(div.firstChild, 1);

        // clear current selection
        var sel = window.getSelection();
        sel.removeAllRanges();

        var createLink = new NativeCommand('createLink');

        createLink.execute(range, 'http://example.com/bar.html');

        assert('<a href="http://example.com/bar.html">h</a>ello <b>world!</b>' === div.innerHTML);

        // test that the current selection is still cleared
        sel = window.getSelection();
        assert(0 === sel.rangeCount);
      });

      it('should insert an A element around given `range` (with `null` for Range)', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.childNodes[1].firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var createLink = new NativeCommand('createLink');

        createLink.execute(null, 'http://example.com/baz.html');
        assert('h<a href="http://example.com/baz.html">ello </a><b><a href="http://example.com/baz.html">wor</a>ld!</b>' === div.innerHTML);
      });

    });


  });

});
