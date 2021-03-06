#!/usr/bin/env sh
set -x

cd /var/www && \
rm -rf js/* && \
tar zxvf travis-deploy-js.tgz -C ./ && \
cp -r pkg-js/adaptive-js/src/* js && \
ls -la js && \
chown -R deploy:www-data js && \
chmod -R 775 js && \
rm -rf pkg-js && \
cd js/fresh && \
php compileAll.php
