#!/bin/sh

docker exec -it investarget-mobile npm build
cp -r build/* prod/
cd prod
git add .
git commit -m "Build for production"
git push
