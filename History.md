
0.2.1 / 2014-10-30
==================

 * package: update outdated dependencies
 * package: allow any "debug" v2
 * test: add Selection/Range tests after execute() calls
 * test: re-enable the Range boundary tests
 * travis: remove extra chrome and firefox, add iphone

0.2.0 / 2014-09-04
==================

 * index: add explanation about manual queryEnabled() impl
 * index: add logic to reset the passed in Range after execute()
 * test: enable Saucelabs + Travis automated testing
 * test: disable the Range selection test for now (fails on IE)
 * test: fix test cases on all browsers
 * package: add "zuul" as a dev dependency
 * README: add Travis-CI build and Install instructions

0.1.1 / 2014-08-21
==================

 * index: ensure that passing in `null` for the Range works as expected
 * index: add Window type declaration for `win` variable
 * index: make `document` be public

0.1.0 / 2014-08-19
==================

 * add "visionmedia/debug" calls
 * npmignore: add empty file so that the generated TS files get published
 * gitignore: ignore index.d.ts and index.js
 * index: make `string` public and `document` private
 * package: add --declaration to `tsc` compile step

0.0.1 / 2014-08-18
==================

 * package: add "prepublish" script to compile TypeScript
 * package: add "browser" keyword
 * add Range-specific overloads of the 3 functions
 * test: add initial mocha tests
 * initial commit
