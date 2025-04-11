#!/usr/bin/env bash

set -e

# Create and activate Python virtual environment
python -m venv .venv
source .venv/bin/activate

# Upgrade pip and install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright Chromium browser and dependencies
playwright install chromium --with-deps
