#!/bin/bash

# Change to the parent directory of 'app'
cd ~/PycharmProjects/rag_app_vercel

# Zip the application, excluding node_modules directories
zip -r app.zip app -x "*/node_modules/*"

# The resulting app.zip will be in the ~/PycharmProjects/rag_app_vercel directory
echo "Application zipped as app.zip"
