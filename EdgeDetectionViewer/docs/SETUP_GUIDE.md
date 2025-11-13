# Detailed Setup Guide

## Prerequisites Installation

### 1. Android Studio Setup

#### Download and Install
```bash
# Linux
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2022.3.1.19/android-studio-2022.3.1.19-linux.tar.gz
tar -xzf android-studio-*.tar.gz
cd android-studio/bin
./studio.sh

# macOS
brew install --cask android-studio

# Windows
# Download from https://developer.android.com/studio
```

#### Configure SDK
1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. Install:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools
   - Android SDK Tools

### 2. NDK Installation

#### Via Android Studio
1. **Tools → SDK Manager → SDK Tools**
2. Check **NDK (Side by side)**
3. Check **CMake**
4. Click **Apply** to install

#### Via Command Line
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Install NDK
sdkmanager "ndk;25.1.8937393"
sdkmanager "cmake;3.22.1"
```

### 3. OpenCV Android SDK

#### Download
```bash
cd ~/Downloads
wget https://github.com/opencv/opencv/releases/download/4.8.0/opencv-4.8.0-android-sdk.zip
unzip opencv-4.8.0-android-sdk.zip
mv OpenCV-android-sdk ~/opencv-android-sdk
```

#### Configure in Project
Create `local.properties` in project root:
```properties
sdk.dir=/home/username/Android/Sdk
ndk.dir=/home/username/Android/Sdk/ndk/25.1.8937393
opencv.dir=/home/username/opencv-android-sdk
```

### 4. Gradle Configuration

#### Update `app/build.gradle`
```gradle
android {
    // ... existing config
    
    defaultConfig {
        // ... existing config
        
        externalNativeBuild {
            cmake {
                cppFlags "-std=c++17"
                arguments "-DOpenCV_DIR=${project.rootDir}/../opencv-android-sdk/sdk/native/jni"
            }
        }
    }
    
    sourceSets {
        main {
            jniLibs.srcDirs = ["${project.rootDir}/../opencv-android-sdk/sdk/native/libs"]
        }
    }
}
```

## Building the Project

### Option 1: Android Studio

1. **Open Project**
   - File → Open
   - Select `EdgeDetectionViewer` directory
   - Wait for Gradle sync

2. **Build**
   - Build → Make Project (Ctrl+F9)
   - Or click the hammer icon

3. **Run**
   - Connect Android device via USB
   - Enable USB debugging on device
   - Run → Run 'app' (Shift+F10)

### Option 2: Command Line

```bash
cd EdgeDetectionViewer

# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Build and install
./gradlew installDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

### Troubleshooting Build Issues

#### Issue: NDK not found
```bash
# Check NDK installation
ls $ANDROID_HOME/ndk/

# If empty, reinstall
sdkmanager --install "ndk;25.1.8937393"
```

#### Issue: OpenCV not found
```bash
# Verify OpenCV path
ls ~/opencv-android-sdk/sdk/native/libs/

# Should show: arm64-v8a, armeabi-v7a, x86, x86_64

# Update local.properties with correct path
echo "opencv.dir=$HOME/opencv-android-sdk" >> local.properties
```

#### Issue: CMake version mismatch
```bash
# Check CMake version
cmake --version

# Install correct version via SDK Manager
sdkmanager "cmake;3.22.1"
```

## Web Viewer Setup

### Install Node.js

```bash
# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Download from https://nodejs.org/
```

### Build Web Viewer

```bash
cd EdgeDetectionViewer/web

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Serve locally
npm run serve
# Open http://localhost:8080 in browser
```

## Device Setup

### Enable Developer Options

1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**

### Connect Device

```bash
# Check device connection
adb devices

# Should show:
# List of devices attached
# ABC123456789    device

# If unauthorized, check device for authorization prompt
```

### Grant Permissions

```bash
# Grant camera permission via ADB
adb shell pm grant com.rnd.edgedetector android.permission.CAMERA

# Or grant manually on device:
# Settings → Apps → Edge Detection Viewer → Permissions → Camera
```

## Testing

### Run on Emulator

```bash
# Create AVD (Android Virtual Device)
avdmanager create avd -n test_device -k "system-images;android-34;google_apis;x86_64"

# Start emulator
emulator -avd test_device

# Install app
./gradlew installDebug
```

### Run on Physical Device

```bash
# Connect device via USB
adb devices

# Install and launch
./gradlew installDebug
adb shell am start -n com.rnd.edgedetector/.MainActivity
```

## Verification

### Check Installation

```bash
# Verify APK is installed
adb shell pm list packages | grep edgedetector

# Check app info
adb shell dumpsys package com.rnd.edgedetector

# View logs
adb logcat | grep EdgeDetector
```

### Performance Testing

```bash
# Monitor FPS
adb shell dumpsys gfxinfo com.rnd.edgedetector

# Monitor memory
adb shell dumpsys meminfo com.rnd.edgedetector

# CPU usage
adb shell top | grep edgedetector
```

## Common Issues

### Camera Not Working
- Check permissions in app settings
- Verify camera hardware with `adb shell dumpsys camera`
- Try different camera ID (0 for back, 1 for front)

### Low FPS
- Reduce camera resolution in code
- Use lower quality edge detection settings
- Test on higher-end device

### Build Errors
- Clean project: `./gradlew clean`
- Invalidate caches: Android Studio → File → Invalidate Caches
- Delete `.gradle` and `build` directories
- Re-sync Gradle

## Next Steps

After successful setup:
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
2. Explore code in `/app/src/main/java` and `/app/src/main/cpp`
3. Modify edge detection parameters in `edge_detector.cpp`
4. Customize UI in `activity_main.xml`
5. Test web viewer at `http://localhost:8080`
