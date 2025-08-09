#!/bin/bash

# Build TypeScript
echo "Building TypeScript..."
npm run clean
npm run build

# Create uploads directory
echo "Creating uploads directory..."
mkdir -p dist/uploads

# Copy static files if any
echo "Copying static files..."
# cp -r public/* dist/ 2>/dev/null || echo "No public files to copy"

echo "Build complete!"
