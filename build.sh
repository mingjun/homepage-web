#!/bin/bash

TARGET_DIR=${PWD}/../www
CSS_COMPRESSOR=yuicompressor.jar
HTML_COMPRESSOR=htmlcompressor.jar

echo build target: $TARGET_DIR


cat <<LINES
-------------------------------------------


LINES

echo synchronize html/img
rsync -rtpzuv --delete --exclude-from=exclude.list ./ $TARGET_DIR/

cat <<LINES
-------------------------------------------


LINES

echo compressing css ..
rm -r $TARGET_DIR/css/*
for FILE in css/*.css
do
    echo compress $FILE
    java -jar $CSS_COMPRESSOR -o $TARGET_DIR"/"$FILE $FILE
done

cat <<LINES
-------------------------------------------


LINES

echo compressing htmls ..

function compressHTML {
    echo compress $1
    java -jar $HTML_COMPRESSOR --type html \
	--compress-js --compress-css \
	-o $TARGET_DIR/$1 $1
}

compressHTML index.html
compressHTML wenxin/index.html
compressHTML search/index.html


cat <<LINES
-------------------------------------------


LINES

echo 'Start dojo-Profile Build'
./js/util/buildscripts/build.sh \
	--profile ./js/xmj.home.profile.js \
	--release \
	--releaseDir $TARGET_DIR \
	--releaseName js
