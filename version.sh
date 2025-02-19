#!/bin/bash

# Get the latest Git tag (version), suppress errors if no tags exist
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)

# If no tags exist, start at 0.1.0-alpha.1
if [ -z "$LATEST_TAG" ]; then
    NEW_VERSION="0.1.0-alpha.1"
else
    # Remove the "v" prefix if it exists
    LATEST_TAG=${LATEST_TAG#v}

    # Ensure the tag is valid before proceeding
    if [[ ! "$LATEST_TAG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-alpha\.[0-9]+)?$ ]]; then
        echo "Error: Latest tag '$LATEST_TAG' is not a valid version format."
        exit 1
    fi

    # Check if the tag contains "-alpha."
    if [[ "$LATEST_TAG" == *"-alpha."* ]]; then
        # Extract base version (e.g., 0.1.0) and alpha number (e.g., 3)
        BASE_VERSION=$(echo "$LATEST_TAG" | sed -E 's/-alpha\.[0-9]+//')
        ALPHA_NUM=$(echo "$LATEST_TAG" | grep -oE 'alpha\.[0-9]+' | cut -d. -f2)
        ALPHA_NUM=$((ALPHA_NUM + 1))
        NEW_VERSION="$BASE_VERSION-alpha.$ALPHA_NUM"
    else
        # Extract major, minor, and patch
        IFS='.' read -r MAJOR MINOR PATCH <<< "$LATEST_TAG"

        case "$1" in
            major)
                MAJOR=$((MAJOR + 1))
                MINOR=0
                PATCH=0
                ;;
            minor)
                MINOR=$((MINOR + 1))
                PATCH=0
                ;;
            patch|*)
                PATCH=$((PATCH + 1))
                ;;
        esac
        NEW_VERSION="$MAJOR.$MINOR.$PATCH-alpha.1"
    fi
fi

# Create and push the new tag
git tag -a "v$NEW_VERSION" -m "Auto-incremented version to v$NEW_VERSION"
git push origin "v$NEW_VERSION"

echo "New version: v$NEW_VERSION"
