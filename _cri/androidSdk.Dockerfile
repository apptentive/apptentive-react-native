FROM ubuntu:18.04 AS sdk

RUN apt update && \
  apt install -y openjdk-8-jdk \
  wget \
  zip unzip \
  libgl1-mesa-glx libgl1-mesa-dri

RUN java -version

# https://developer.android.com/studio/#downloads
RUN wget -O android_sdk.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip && \
  mkdir -p /android_sdk && \
  mkdir -p /root/.android && \
  touch /root/.android/repositories.cfg

RUN unzip android_sdk.zip -d /android_sdk && \
  rm android_sdk.zip

ENV PATH "/android_sdk/tools/bin:$PATH"
ENV PATH "/android_sdk/tools:$PATH"
ENV PATH "/android_sdk/platform-tools:$PATH"
ENV PATH "/android_sdk/emulator:$PATH"

RUN yes | sdkmanager --licenses

RUN sdkmanager "emulator" "tools" "platform-tools"
RUN sdkmanager "build-tools;28.0.3" "platforms;android-28" > /dev/null

RUN sdkmanager 'system-images;android-24;default;arm64-v8a'
RUN echo no | avdmanager create avd -n apptentiveEmulator -k 'system-images;android-24;default;arm64-v8a' --force

CMD emulator -avd apptentiveEmulator -noaudio -no-boot-anim -no-window -gpu off
