#!/bin/sh

yarn build
cp -r build/* test/
cd test
git add .
git commit -m "Build for test"
git push