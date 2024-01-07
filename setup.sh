#!/bin/bash

# Step 1: Update your package manager (optional but recommended)
echo "Updating package manager..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js (includes npm)
echo "Installing Node.js..."
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -  # Adjust the Node.js version as needed
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# Step 3: Install pnpm
echo "Installing pnpm..."
npm install -g pnpm

# Verify pnpm installation
echo "pnpm version:"
pnpm --version

# Step 4: Navigate to your project directory (replace '/path/to/your/project' with your actual project path)
cd /path/to/your/project

# Step 5: Install dependencies using pnpm
echo "Installing dependencies..."
pnpm install

echo "Setup complete."
