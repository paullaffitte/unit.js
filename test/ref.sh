#! /usr/bin/env bash

echo -n "koala"
if [ $# -ne 0 ]; then
	echo -n ":("
fi

if [ $# = 2 ]; then
	echo -n " ... :)"
fi