reduce-group
===================

Reduce objects by group levels, much like couchdb. Use built in functions like _sum, _count, and _stats.


Module Usage
------------

    npm install reduce-group

and then

    var db = require('levelup')('/in/memory', { db: require('memdown') });
    var reducer = require('reduce-group')(db);


    reducer.pipe(concat(function(objs){
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
    reducer.write({ "key": ["c3rrcv5","Robbery"], "value": 3});
    reducer.write({ "key": ["c3rrcv4","Robbery"], "value": 2});
    reducer.write({ "key": ["c3rrcv1","Robbery"], "value": 2});
    reducer.write({ "key": ["c3rrcv0","Robbery"], "value": 1});
    reducer.write({ "key": ["c3rrcyz","Robbery"], "value": 3});
    reducer.write({ "key": ["c3rrcv5","Assualt"], "value": 1});
    reducer.write({ "key": ["c3rrcv4","Assualt"], "value": 1});
    reducer.write({ "key": ["c3rrcv1","Assualt"], "value": 1});
    reducer.write({ "key": ["c3rrcv0","Robbery"], "value": 1});
    reducer.write({ "key": ["c3rrcv5","Robbery"], "value": 0});
    reducer.write({ "key": ["c3rrcv4","Robbery"], "value": 2});
    reducer.write({ "key": ["c3rrcv1","Robbery"], "value" :1.4});
    reducer.write({ "key": ["c3rrcv0","Robbery"], "value": 12});
    reducer.end()


See it run here: https://runkit.com/58923e6f56d1720014b8b4d1/58923f648417ac00141964d7

Command Line Usage
------------------

    npm install reduce-group -g

first, find some data in ndjson format, with objects with keys and values on each line. Something like


```
cat data.json

{ "key": ["c3rrcv5","Robbery"], "value": 3}
{ "key": ["c3rrcv4","Robbery"], "value": 2}
{ "key": ["c3rrcv1","Robbery"], "value": 2}
{ "key": ["c3rrcv0","Robbery"], "value": 1}
{ "key": ["c3rrcyz","Robbery"], "value": 3}
{ "key": ["c3rrcv5","Assualt"], "value": 1}
{ "key": ["c3rrcv4","Assualt"], "value": 1}
{ "key": ["c3rrcv1","Assualt"], "value": 1}
{ "key": ["c3rrcv0","Robbery"], "value": 1}
{ "key": ["c3rrcv5","Robbery"], "value": 0}
{ "key": ["c3rrcv4","Robbery"], "value": 2}
{ "key": ["c3rrcv1","Robbery"], "value" :1.4}
{ "key": ["c3rrcv0","Robbery"], "value": 12}

```


so to reduce to the sums of all crime types in a geohash, do the following:

```
cat mapped.json | reduce-group

{ key: [ 'c3rrcv0' ], value: 14 }
{ key: [ 'c3rrcv1' ], value: 4.4 }
{ key: [ 'c3rrcv4' ], value: 5 }
{ key: [ 'c3rrcv5' ], value: 4 }
{ key: [ 'c3rrcyz' ], value: 3 }
```

by default this is run with a --group_level=1. You can change the it to a level 2, like so:


```
cat mapped.json | reduce-group  --group_level=2

{ key: [ 'c3rrcv0', 'Robbery' ], value: 14 }
{ key: [ 'c3rrcv1', 'Assualt' ], value: 1 }
{ key: [ 'c3rrcv1', 'Robbery' ], value: 3.4 }
{ key: [ 'c3rrcv4', 'Assualt' ], value: 1 }
{ key: [ 'c3rrcv4', 'Robbery' ], value: 4 }
{ key: [ 'c3rrcv5', 'Assualt' ], value: 1 }
{ key: [ 'c3rrcv5', 'Robbery' ], value: 3 }
{ key: [ 'c3rrcyz', 'Robbery' ], value: 3 }
```

The ndjson output will be ordered by key. It is using _sum to reduce the value, grouped by the first two columns of the key.

There are other built in functions, eg _count

```
cat mapped.json | reduce-group --reduce=_count

{ key: [ 'c3rrcv0' ], value: 3 }
{ key: [ 'c3rrcv1' ], value: 3 }
{ key: [ 'c3rrcv4' ], value: 3 }
{ key: [ 'c3rrcv5' ], value: 3 }
{ key: [ 'c3rrcyz' ], value: 1 }
```

```
example.json | reduce-group --group_level=2  --reduce=_count
{"key":["c3rrcv0","Robbery"],"value":3}
{"key":["c3rrcv1","Assualt"],"value":1}
{"key":["c3rrcv1","Robbery"],"value":2}
{"key":["c3rrcv4","Assualt"],"value":1}
{"key":["c3rrcv4","Robbery"],"value":2}
{"key":["c3rrcv5","Assualt"],"value":1}
{"key":["c3rrcv5","Robbery"],"value":2}
{"key":["c3rrcyz","Robbery"],"value":1}
```


and _stats

```
cat mapped.json | reduce-group --reduce=_stats

{"key":["c3rrcv0"],"value":{"min":1,"max":12,"sum":14,"count":3,"sumsqr":146}}
{"key":["c3rrcv1"],"value":{"min":1,"max":2,"sum":4.4,"count":3,"sumsqr":6.96}}
{"key":["c3rrcv4"],"value":{"min":1,"max":2,"sum":5,"count":3,"sumsqr":9}}
{"key":["c3rrcv5"],"value":{"min":0,"max":3,"sum":4,"count":3,"sumsqr":10}}
{"key":["c3rrcyz"],"value":{"min":3,"max":3,"sum":3,"count":1,"sumsqr":9}}
```




All Options
-----------

 - --group_level=1  What level to group the data at,
 - --reduce=_sum  How to reduce. Can be _sum, _stats, _count or a custom reduce function
 - --file=reduce.js Define a reduce in an external js file.
 - --db_module=memdown What backing to store the reduce in. Larger datasets might want 'leveldown'
 - --db_path=./data Where to store a persistent level store like leveldown.
 - --separator='\xff' The default separator in the underlying leveldb



Future
------

This is the first release. I plan to have reduce options such as _sum, _count and _stats in the future.





