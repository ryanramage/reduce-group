ldjson-reduce-group
===================

Reduce ldjson by group levels, much like couchdb

Install
-------

    npm install ldjson-reduce-group

Usage
-----

first, find some data in ldjson format, with arrays on each line. Something like


```

cat data.json

["c3x2c0c","Break and Enter",0.09924843836930088]
["c3x2c0b","Break and Enter",0.07131786992142247]
["c3x2c0x","Break and Enter",0.20350682717846091]
["c3x2c0w","Break and Enter",0.221410262622791]
["c3x2c0t","Break and Enter",0.2222547142552161]
["c3x2c0s","Break and Enter",0.20580123000056702]
["c3x2c0c","Break and Enter",0.17640552899101838]
```

or the ldjson can be in object format like this

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
cat mapped.json | ldjson-reduce-group  --group_level=2

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

All Options
-----------

 - --group_level=1  What level to group the data at,
 - --db_module=memdown What backing to store the reduce in. Larger datasets might want 'leveldown'
 - --db_path=./data Where to store a persistent level store like leveldown.
 - --seperator='\xff' The default seperator in the underlying leveldb



Future
------

This is the first release. I plan to have reduce options such as _sum, _count and _stats in the future.





