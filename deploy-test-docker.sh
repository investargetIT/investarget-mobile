#!/bin/sh

sed -i '' -e 's|https://api|http://apitest|' src/request.js
docker exec -it investarget-mobile npm build
cp -r build/* test/
cd test
git add .
git commit -m "Build for test"
git push
