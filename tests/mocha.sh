#!/bin/bash
SPECS=`dirname $0`
MOCHA=$SPECS/../node_modules/mocha/bin/mocha
echo Running $SPECS/$1*

$MOCHA --reporter spec $2 $SPECS/$1* --timeout 11000
