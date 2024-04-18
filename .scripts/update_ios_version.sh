#!/usr/bin/env bash

# Fail on first error.
set -e

# Check for correct number of arguments.
if [ $# -ne 2 ]; then
    echo "Usage: $0 <podspec_filename> <new.ApptentiveKit.version>"
    exit 1
fi

dependency_name="ApptentiveKit"
new_version="$2"
podspec_file="$1"

# Check if the podspec file exists
if [ ! -f "$podspec_file" ]; then
    echo "Error: $podspec_file does not exist."
    exit 1
fi

# Use sed to update the version in the podspec file
sed -i "s/s.dependency '$dependency_name', '[^']*'/s.dependency '$dependency_name', '~> $new_version'/" "$podspec_file"

echo "Updated $dependency_name to version $new_version in $podspec_file."
