ldjson-reduce-group
===================

Reduce ldjson by group levels, much like couchdb

Install
-------

    npm install ldjson-reduce-group

Usage
-----

first, find some data in ldjson format, with objects with keys and values on each line. Something like


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
cat mapped.json | ldjson-reduce-group

{ key: [ 'c3rrcv0' ], value: 14 }
{ key: [ 'c3rrcv1' ], value: 4.4 }
{ key: [ 'c3rrcv4' ], value: 5 }
{ key: [ 'c3rrcv5' ], value: 4 }
{ key: [ 'c3rrcyz' ], value: 3 }
```

by default this is run with a --group_level=1. You can change the it to a level 2, like so:


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
 - --separator='\xff' The default separator in the underlying leveldb



Future
------

This is the first release. I plan to have reduce options such as _sum, _count and _stats in the future.





