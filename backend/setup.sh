#!/bin/bash

# Install system packages required by Chromium
apt-get update && apt-get install -y \
  libgtk-4-1 \
  libgraphene-1.0-0 \
  libgstreamer-gl1.0-0 \
  libgstreamer-plugins-base1.0-0 \
  libavif15 \
  libenchant-2-2 \
  libsecret-1-0 \
  libmanette-0.2-0 \
  libgles2

# Python setup
pip install --upgrade pip
pip install -r requirements.txt

# Playwright browsers
playwright install chromium
