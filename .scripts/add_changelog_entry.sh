#!/usr/bin/env bash

# Fail on first error.
set -e

# Check for correct number of arguments.
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <new.distribution.version> <new.ios.version> <new.android.version>"
    exit 1  # Exit the script with an error status
fi

# Create and change to a temporary directory.
mkdir CHANGELOG-update
cd CHANGELOG-update

# Split the CHANGELOG.md file into multiple parts with a pattern matching 
# the start of a new version entry.
# The filenames with be 'xaa', 'xab', 'xac', etc.
cat ../CHANGELOG.md | csplit -s - '/^# 20/' {1}

# Create the new version entry's heading and add it to a file whose name
# is alphabetically after the CHANGELOG's preamble.
echo "# $(date -Idate) - v$1" > xx00a
echo "" >> xx00a

# Add the new version entry's body a file whose name is alphabetically 
# after the heading.
echo "- Apptentive Android SDK: $2" > xx00b
echo "- Apptentive iOS SDK: $3" >> xx00b
echo "" >> xx00b

# Copy the new entry to print out later.
NEW_ENTRY=$(cat xx00b)

# Reassebmble the parts of the changelog into a local copy.
cat $(ls -1 | sort) > foo.md

# Move the local copy of the changelog to the original location.
mv foo.md ../CHANGELOG.md

# Clean up the temporary directory.
rm x*
cd ..
rmdir CHANGELOG-update

echo "$NEW_ENTRY"
