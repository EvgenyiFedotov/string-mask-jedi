#!/usr/bin/env bash

FILE_NAME="package-pack.tgz"
PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[ ",]//g')
PACKAGE_LINK="$PACKAGE_NAME-pack"

yarn pack --filename $FILE_NAME
mkdir -pv ../$PACKAGE_LINK
tar -xvzf $FILE_NAME -C ../$PACKAGE_LINK
rm $FILE_NAME
cd ../$PACKAGE_LINK/package
yarn link
