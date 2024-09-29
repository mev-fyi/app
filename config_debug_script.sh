#!/bin/bash

# Define an array of file paths
FILES=(
  "vercel.json"
  "tsconfig.json"
  "tailwind.config.js"
  "package.json"
  "next.config.js"
)

remove_comments="${1:-true}"  # Default to true if no parameter is provided

# Directory where logs are stored
log_dir="logs"

# Find the most recent log file
log_file=$(ls -t "$log_dir"/*.txt 2>/dev/null | head -n 1)

# Variable to determine if logs were processed
logs_processed=false

if [ -n "$log_file" ]; then
  # Extract the first error log and everything that follows from the most recent log file
  context=$(awk '/\[ERROR\]/ {flag=1} flag' "$log_file")
  pre_error_context=$(awk '/\[ERROR\]/ {for (i=NR-5; i<NR; i++) print lines[i%4]; flag=1} {lines[NR%4]=$0} flag' "$log_file")

  # Check if any errors were found
  if [ -n "$context" ]; then
    logs_processed=true
  fi
fi

# Specify the directory path of interest for the tree command
tree_dir="."  # Update this to your path of interest

{
echo "\`\`\`"  # Start triple backticks
for file in "${FILES[@]}"; do
    echo "File: $file"
    echo "---------------------------------"
    cat "$file"
    echo ""
    echo "================================="
    echo ""
done

# Print directory structure of the specified path excluding certain paths
tree "$tree_dir" -I "node_modules|public|components|lib|assets|fonts" -L 4

# Conditionally add the pre-error context and error section if logs were processed
if [ "$logs_processed" = true ]; then
    echo ""
    echo "Pre-Error Context (5 lines before the first error) and First Error Context from $log_file:"
    echo "---------------------------------"
    echo "$pre_error_context"
    echo "$context"
    echo "================================="
fi

echo "\`\`\`"  # End triple backticks
if [ "$logs_processed" = true ]; then
    echo "Please fix"
else
    echo "Given the above: "
fi
} | xclip -selection clipboard

echo "Logs and script content have been copied to clipboard."
