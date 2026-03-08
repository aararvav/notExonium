#!/bin/bash

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

echo "Starting build process..."
echo "Git URL: $GIT_REPOSITORY__URL"
echo "Project ID: $PROJECT_ID"

if [ -z "$GIT_REPOSITORY__URL" ]; then
    echo "ERROR: GIT_REPOSITORY__URL is not set"
    exit 1
fi

echo "Cloning repository..."
git clone "$GIT_REPOSITORY__URL" /home/app/output

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to clone repository"
    exit 1
fi

echo "Repository cloned successfully"
echo "Starting build script..."

exec node script.js