#!/usr/bin/env

# emulator -avd apptentiveEmulator -noaudio -no-boot-anim -no-window -gpu off &
# adb wait-for-device

# adb devices

cd sample61
npm run android &

cd android
./gradlew tasks
