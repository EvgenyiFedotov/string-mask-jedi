#!/usr/bin/env bash

PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[ ",]//g')
PACKAGE_LINK="$PACKAGE_NAME-pack"

cd ../$PACKAGE_LINK/package
yarn unlink
rm -fr ../../$PACKAGE_LINK
