#!/usr/bin/env bash

# This script should update any incidental copies of the 
# "single source of truth" version, e.g. in package.json.
# It will be different for each project.

# Fail on first error.
set -e

# Check for correct number of arguments.
if [ $# -ne 1 ]; then
    echo "Usage: $0 <new.distribution.version>"
    exit 1
fi

new_version="$1"
package_json="package.json"

# Check if the podspec file exists
if [ ! -f "$package_json" ]; then
    echo "Error: $package_json does not exist."
    exit 1
fi

version_script=".version=\"$new_version\""
yq -iP $version_script "$package_json" -o json

echo "Updated version to $new_version in $package_json."

podspec_file="apptentive-react-native.podspec"

# Check if the podspec file exists
if [ ! -f "$podspec_file" ]; then
    echo "Error: $podspec_file does not exist."
    exit 1
fi

# Use sed to update the version in the podspec file
sed -i "s/s.version\( *\)= *\"[^\"]*\"/s.version\1= \"$new_version\"/" "$podspec_file"

echo "Updated version to $new_version in $podspec_file."

# React native code reads version from package.json at runtime