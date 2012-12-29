#!/bin/bash

TARGET_DIR=${PWD}/../www
echo build target: $TARGET_DIR


cat <<LINES
-------------------------------------------


LINES

echo synchronize html/img/css
rsync -rtpzuv --delete --exclude-from=exclude.list ./ $TARGET_DIR/

cat <<LINES
-------------------------------------------


LINES

echo 'Start dojo-Profile Build'
./js/util/buildscripts/build.sh \
	--profile ./js/xmj.home.profile.js \
	--release \
	--releaseDir $TARGET_DIR \
	--releaseName js
