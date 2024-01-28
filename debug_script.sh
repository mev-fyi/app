#!/bin/bash

# Define an array of file paths
FILES=(
  "app/chat/[id]/page.tsx"  
  "app/page.tsx"  
  "components/share-chat-header.tsx"
  "app/share/[id]/page.tsx"
)
# "components/sidebar-list.tsx"
# "components/sidebar-actions.tsx"
# "app/api/auth/[...nextauth]/route.ts"
# "app/api/chat/route.ts"
# "app/chat/[id]/page.tsx"
# "app/share/[id]/opengraph-image.tsx"
# "app/share/[id]/page.tsx"
# "app/actions.ts"
# "app/page.tsx"


# Loop over the array and display each file's name and content
for file in "${FILES[@]}"; do
    echo "File: $file"
    echo "---------------------------------"
    cat "$file"
    echo ""
    echo "================================="
    echo ""
done
# tree -I "node_modules|public|components|lib|assets"

