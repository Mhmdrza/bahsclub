#!/bin/sh
# Install the pre-commit hook into .git/hooks
cp "$(dirname "$0")/pre-commit" "$(dirname "$0")/../.git/hooks/pre-commit"
chmod +x "$(dirname "$0")/../.git/hooks/pre-commit"
echo "✓ Pre-commit hook installed. Content will be validated before every commit."