var fs = require('fs');
var path = require('path');
var test = require('tape');
var levelup = require('levelup');
var memdown = require('memdown');
var ldj = require('ldjson-stream');
var pumpify = require('pumpify');
var concat = require('concat-stream');

var reduce_group = require('..');

test('basic reduce', function (t) {

  var db = levelup('/blah', { db: memdown });
  var reducer = reduce_group(db, {group_level: 2});

  var stream = concat(concatted)
  function concatted(objs) {

    t.equal(objs.length, 5)

    var expected = [
        { key: [ 'c3rrcv0', 'Robbery' ], value: 14 },
        { key: [ 'c3rrcv1', 'Robbery' ], value: 4.4 },
        { key: [ 'c3rrcv4', 'Robbery' ], value: 5 },
        { key: [ 'c3rrcv5', 'Robbery' ], value: 4 },
        { key: [ 'c3rrcyz', 'Robbery' ], value: 3 }
    ];
    t.deepEqual(objs, expected)
    t.end();

  }

  fs.createReadStream(path.resolve(__dirname, 'fixtures/basic.ldjson'))
    .pipe(ldj.parse())
    .pipe(reducer)
    .pipe(stream)

});