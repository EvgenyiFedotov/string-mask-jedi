#!/usr/bin/env bash

yarn build-storybook

mkdir -p package
mv .* ./package 2>/dev/null || :
mv * ./package 2>/dev/null || :
mv ./package/.git ./  2>/dev/null || :
mv ./package/storybook-static/* ./ 2>/dev/null || :
rm -fr package

git push origin :gh-pages 2>/dev/null || :
git branch -D gh-pages 2>/dev/null || :
git checkout -b gh-pages
git add -A
git commit -m "[storybook] update"
git push -u -f origin gh-pages
