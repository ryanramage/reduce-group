var fs = require('fs');
var path = require('path');
var test = require('tape');
var levelup = require('levelup');
var memdown = require('memdown');
var ldj = require('ldjson-stream');
var pumpify = require('pumpify');
var concat = require('concat-stream');

var reduce_group = require('..');

test('basic reduce, group 1', function (t) {

  var db = levelup('/t1', { db: memdown });
  var reducer = reduce_group(db);

  fs.createReadStream(path.resolve(__dirname, 'fixtures/basic.ldjson'))
    .pipe(ldj.parse())
    .pipe(reducer)
    .pipe(concat(function(objs){
      var expected = [
        { key: [ 'c3rrcv0' ], value: 14 },
        { key: [ 'c3rrcv1' ], value: 4.4 },
        { key: [ 'c3rrcv4' ], value: 5 },
        { key: [ 'c3rrcv5' ], value: 4 },
        { key: [ 'c3rrcyz' ], value: 3 }
      ];
      t.deepEqual(objs, expected)
      t.end();
    }))

});

test('basic reduce, group 2', function (t) {

  var db = levelup('/t2', { db: memdown });
  var reducer = reduce_group(db, {group_level: 2});

  fs.createReadStream(path.resolve(__dirname, 'fixtures/group_level2.ldjson'))
    .pipe(ldj.parse())
    .pipe(reducer)
    .pipe(concat(function(objs){
      var expected = [
        { key: [ 'c3rrcv0', 'Robbery' ], value: 14 },
        { key: [ 'c3rrcv1', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv1', 'Robbery' ], value: 3.4 },
        { key: [ 'c3rrcv4', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv4', 'Robbery' ], value: 4 },
        { key: [ 'c3rrcv5', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv5', 'Robbery' ], value: 3 },
        { key: [ 'c3rrcyz', 'Robbery' ], value: 3 }
      ];
      t.deepEqual(objs, expected)
      t.end();
    }))

});


test('reduce key/value object, group 2', function (t) {

  var db = levelup('/t3', { db: memdown });
  var reducer = reduce_group(db, {group_level: 2});

  fs.createReadStream(path.resolve(__dirname, 'fixtures/key_value.ldjson'))
    .pipe(ldj.parse())
    .pipe(reducer)
    .pipe(concat(function(objs){
      var expected = [
        { key: [ 'c3rrcv0', 'Robbery' ], value: 14 },
        { key: [ 'c3rrcv1', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv1', 'Robbery' ], value: 3.4 },
        { key: [ 'c3rrcv4', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv4', 'Robbery' ], value: 4 },
        { key: [ 'c3rrcv5', 'Assualt' ], value: 1 },
        { key: [ 'c3rrcv5', 'Robbery' ], value: 3 },
        { key: [ 'c3rrcyz', 'Robbery' ], value: 3 }
      ];
      t.deepEqual(objs, expected)
      t.end();
    }))

});

test('reduce key/value object, with string as key', function (t) {

  var db = levelup('/t4', { db: memdown });
  var reducer = reduce_group(db, {group_level: 2});

  fs.createReadStream(path.resolve(__dirname, 'fixtures/object_key_string.ldjson'))
    .pipe(ldj.parse())
    .pipe(reducer)
    .pipe(concat(function(objs){
      var expected = [
        { key: 'c3rrcv0', value: 14 },
        { key: 'c3rrcv1', value: 4.4 },
        { key: 'c3rrcv4', value: 5 },
        { key: 'c3rrcv5', value: 4 },
        { key: 'c3rrcyz', value: 3 }
      ];
      t.deepEqual(objs, expected)
      t.end();
    }))

});
