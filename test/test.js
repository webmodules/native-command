
var assert = require('assert');
var query = require('component-query');
var closest = require('component-closest');
var normalize = require('range-normalize');
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
      assert.equal(bold.name, 'bold');
      assert.equal(bold.document, document);
    });

    describe('execute()', function () {

      it('should insert a B element around selection', function () {
        div = document.createElement('div');
        div.innerHTML = 'hello <b>world!</b>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current Selection
        var range = document.createRange();
        range.setStart(div.firstChild, 1);
        range.setEnd(div.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var bold = new NativeCommand('bold');
        bold.execute();

        // test that we have the expected HTML at this point
        // Note that IE uses STRONG instead of B
        assert(/h<(b|strong)>el<\/(b|strong)>lo <b>world!<\/b>/.test(div.innerHTML));

        // test that the current Selection contains the "el"
        sel = window.getSelection();
        assert.equal('el', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        // Note that IE uses STRONG instead of B
        assert(/<(b|strong)>he<\/(b|strong)>llo <b>world!<\/b>/.test(div.innerHTML));

        // test that the given Range has the B element selected
        assert.equal('he', range.toString());

        // IE selects the <div> as the startContainer, so let's normalize first
        normalize(range);

        assert.equal('he', range.toString());
        assert(range.startContainer === div.firstChild.firstChild);
        assert(range.startOffset === 0);
        assert(range.endContainer === div.firstChild.firstChild);
        assert(range.endOffset === 2);

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

        // we can't just compare raw HTML here since older (v12) Opera
        // inserts the A tag in a different hierarchy order than other
        // web browsers:
        //  Opera v12: 'h<a href="http://example.com/foo.html">ello <b>wor</b></a><b>ld!</b>'
        //  Others:    'h<a href="http://example.com/foo.html">ello </a><b><a href="http://example.com/foo.html">wor</a>ld!</b>'
        var a, b;

        a = closest(div.childNodes[1].firstChild, 'a');
        assert(a);
        assert(a.nodeName === 'A');
        assert(a.href === 'http://example.com/foo.html');

        b = closest(div.childNodes[1].firstChild, 'b');
        assert(!b);

        // TODO: add more definitive tests...

        // test that the current Selection is in the proper place
        sel = window.getSelection();
        assert.equal('ello wor', sel.getRangeAt(0).toString());
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

        // test that the Range contains the text within the A
        assert.equal('h', range.toString());
      });

      it('should insert an A element around selection (with `null` for Range)', function () {
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

        // again, we can't just compare raw HTML here since older (v12) Opera
        // inserts the A tag in a different hierarchy order than other
        // web browsers:
        //  Opera v12: 'h<a href="http://example.com/foo.html">ello <b>wor</b></a><b>ld!</b>'
        //  Others:    'h<a href="http://example.com/baz.html">ello </a><b><a href="http://example.com/baz.html">wor</a>ld!</b>'
        var a, b;

        a = closest(div.childNodes[1].firstChild, 'a');
        assert(a);
        assert(a.nodeName === 'A');
        assert(a.href === 'http://example.com/baz.html');

        b = closest(div.childNodes[1].firstChild, 'b');
        assert(!b);

        // TODO: add more definitive tests...


        // test that the current Selection is in the proper place
        sel = window.getSelection();
        assert.equal('ello wor', sel.getRangeAt(0).toString());
      });

    });


  });

  describe('"insertUnorderedList" command', function () {

    it('should create a "insertUnorderedList" command', function () {
      var insertUnorderedList = new NativeCommand('insertUnorderedList');

      assert(insertUnorderedList instanceof NativeCommand);
      assert(insertUnorderedList.name === 'insertUnorderedList');
      assert(insertUnorderedList.document === document);
    });

    describe('execute()', function () {

      it('should insert a UL block around selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 3);
        assert(!range.collapsed);
        assert.equal('el', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var insertUnorderedList = new NativeCommand('insertUnorderedList');
        assert(!query('ul', div));

        // should create a UL within the DIV
        insertUnorderedList.execute();
        assert(query('ul', div));

        // test that the current Selection is in the proper place
        sel = window.getSelection();
        assert(!sel.getRangeAt(0).collapsed);
        assert.equal('el', sel.getRangeAt(0).toString());

        // now inverse function
        insertUnorderedList.execute();
        assert(!query('ul', div));

        // test that the current Selection is in the proper place
        sel = window.getSelection();
        assert(!sel.getRangeAt(0).collapsed);
        assert.equal('el', sel.getRangeAt(0).toString());
      });

    });

  });

});
