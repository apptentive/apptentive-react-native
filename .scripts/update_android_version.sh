#!/usr/bin/env bash

# Fail on first error.
set -e

# Check for correct number of arguments.
if [ $# -ne 2 ]; then
    echo "Usage: $0 <build.gradle_filename> <new.apptentive-kit-android.version>"
    exit 1
fi

dependency_name="com.apptentive:apptentive-kit-android"
new_version="$2"
build_gradle_file="$1"

# Check if the build.gradle file exists
if [ ! -f "$build_gradle_file" ]; then
    echo "Error: $build_gradle_file does not exist."
    exit 1
fi

# Use sed to update the version in the podspec file
sed -i "s/implementation '$dependency_name:[^']*'/implementation '$dependency_name:$new_version'/" "$build_gradle_file"

echo "Updated $dependency_name to version $new_version in $build_gradle_file."
