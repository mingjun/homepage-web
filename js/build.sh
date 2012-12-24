#!/bin/bash

echo 'start dojo build'

./util/buildscripts/build.sh \
	--profile ./xmj.home.profile.js \
	--release \
	--releaseDir ~/www \
	--releaseName js
