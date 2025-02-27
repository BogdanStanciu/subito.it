#!/bin/sh
set -e

echo "Starting build process..."
npm install
npm run build
echo "Build completed successfully!"