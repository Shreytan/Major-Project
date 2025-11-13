# 🎨 Edge Detection Viewer

A real-time edge detection application combining **Android**, **OpenCV C++**, **OpenGL ES 2.0**, and **TypeScript** for advanced image processing and visualization.

![Platform](https://img.shields.io/badge/Platform-Android-green.svg)
![OpenCV](https://img.shields.io/badge/OpenCV-4.8.0-blue.svg)
![OpenGL](https://img.shields.io/badge/OpenGL-ES%202.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)

## 📸 Screenshots

### Android Application
<table>
  <tr>
    <td><img src="docs/screenshots/raw_feed.png" alt="Raw Camera Feed" width="300"/></td>
    <td><img src="docs/screenshots/edge_detection.png" alt="Edge Detection" width="300"/></td>
  </tr>
  <tr>
    <td align="center"><b>Raw Camera Feed</b></td>
    <td align="center"><b>Edge Detection Mode</b></td>
  </tr>
</table>

### Web Viewer
<img src="docs/screenshots/web_viewer.png" alt="Web Viewer Interface" width="600"/>

## ✨ Features Implemented

### Android Application
- ✅ **Real-time Camera Feed** - Camera2 API with TextureView integration
- ✅ **OpenCV C++ Processing** - Canny edge detection via JNI
- ✅ **OpenGL ES 2.0 Rendering** - Hardware-accelerated frame rendering
- ✅ **Toggle Mode** - Switch between raw feed and edge-detected output
- ✅ **FPS Counter** - Real-time performance monitoring
- ✅ **Processing Time Display** - Frame processing metrics
- ✅ **Smooth Performance** - Maintains 15-30 FPS on most devices

### Web Viewer
- ✅ **TypeScript Implementation** - Type-safe, modular code
- ✅ **Frame Display** - Canvas-based image rendering
- ✅ **Statistics Overlay** - FPS, resolution, processing time
- ✅ **Sample Frame Generation** - Procedural edge pattern generation
- ✅ **Image Upload** - Load and process custom images
- ✅ **Responsive Design** - Modern, gradient-based UI

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Android Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  MainActivity │────────▶│  GLRenderer  │                  │
│  │   (Kotlin)   │         │   (Kotlin)   │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │ Camera2 API            │ OpenGL ES 2.0             │
│         │                        │                           │
│  ┌──────▼───────┐         ┌──────▼───────┐                  │
│  │ SurfaceTexture│────────▶│  Texture     │                  │
│  │              │         │  Rendering   │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                                                     │
│         │ JNI Bridge                                         │
│         │                                                     │
│  ┌──────▼────────────────────────────────┐                  │
│  │     Native Layer (C++)                │                  │
│  │  ┌────────────────────────────────┐   │                  │
│  │  │  OpenCV Processing             │   │                  │
│  │  │  - Canny Edge Detection        │   │                  │
│  │  │  - Grayscale Conversion        │   │                  │
│  │  │  - Gaussian Blur               │   │                  │
│  │  └────────────────────────────────┘   │                  │
│  └───────────────────────────────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Web Viewer (TypeScript)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   app.ts     │────────▶│ HTML5 Canvas │                  │
│  │  (TypeScript)│         │              │                  │
│  └──────┬───────┘         └──────────────┘                  │
│         │                                                     │
│         │ Frame Processing                                   │
│         │                                                     │
│  ┌──────▼───────────────────────────────┐                   │
│  │  - Base64 Image Decoding             │                   │
│  │  - Statistics Display                │                   │
│  │  - Edge Detection Simulation         │                   │
│  └──────────────────────────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Camera Capture** → Camera2 API captures frames to SurfaceTexture
2. **JNI Transfer** → Frame data sent to C++ layer via JNI
3. **OpenCV Processing** → Canny edge detection applied in native code
4. **OpenGL Rendering** → Processed frame rendered as texture
5. **Display Update** → GLSurfaceView displays the result

### Component Breakdown

#### `/app` - Android Application Layer
- **MainActivity.kt** - Camera setup, permissions, UI controls
- **NativeProcessor.kt** - JNI interface wrapper
- **GLRenderer.kt** - OpenGL ES rendering logic

#### `/jni` - Native Processing Layer
- **native-processor.cpp** - JNI bridge implementation
- **edge_detector.cpp** - OpenCV algorithms (Canny, Sobel, Laplacian)
- **CMakeLists.txt** - NDK build configuration

#### `/gl` - OpenGL Shaders & Utilities
- Vertex and fragment shaders for texture rendering
- OpenGL ES 2.0 setup and configuration

#### `/web` - TypeScript Web Viewer
- **app.ts** - Main application logic
- **index.html** - Web interface
- **styles.css** - Modern gradient-based styling

## ⚙️ Setup Instructions

### Prerequisites

#### For Android Development
- **Android Studio** Arctic Fox or later
- **Android SDK** API Level 24+ (Android 7.0+)
- **Android NDK** r21 or later
- **CMake** 3.22.1+
- **OpenCV Android SDK** 4.8.0

#### For Web Development
- **Node.js** 16+ and npm
- **TypeScript** 5.2+

### Android Setup

#### 1. Install Android NDK

```bash
# Via Android Studio
# Tools → SDK Manager → SDK Tools → NDK (Side by side)

# Or via command line
sdkmanager --install "ndk;25.1.8937393"
```

#### 2. Download OpenCV Android SDK

```bash
# Download from official OpenCV releases
wget https://github.com/opencv/opencv/releases/download/4.8.0/opencv-4.8.0-android-sdk.zip

# Extract to your preferred location
unzip opencv-4.8.0-android-sdk.zip -d ~/opencv-android
```

#### 3. Configure OpenCV in Project

Edit `local.properties` (create if doesn't exist):

```properties
sdk.dir=/path/to/Android/Sdk
ndk.dir=/path/to/Android/Sdk/ndk/25.1.8937393
opencv.dir=/path/to/opencv-android-sdk
```

Update `app/build.gradle` to include OpenCV:

```gradle
android {
    // ... existing config
    
    sourceSets {
        main {
            jniLibs.srcDirs = ["${project.rootDir}/../opencv-android-sdk/sdk/native/libs"]
        }
    }
}
```

#### 4. Build the Project

```bash
# Open in Android Studio
# File → Open → Select EdgeDetectionViewer directory

# Or build via command line
./gradlew assembleDebug

# Install on device
./gradlew installDebug
```

#### 5. Grant Camera Permissions

When you first launch the app, grant camera permissions when prompted.

### Web Viewer Setup

```bash
cd web

# Install dependencies
npm install

# Build TypeScript
npm run build

# Serve locally
npm run serve

# Open browser to http://localhost:8080
```

## 🚀 Usage

### Android App

1. **Launch the app** - Camera feed starts automatically
2. **Toggle Mode** - Tap the "Toggle Mode" button to switch between:
   - Raw camera feed
   - Edge-detected output
3. **Monitor Performance** - View real-time stats in the top-right overlay:
   - FPS (Frames Per Second)
   - Processing time (milliseconds)
   - Current mode

### Web Viewer

1. **Open in browser** - Navigate to `http://localhost:8080`
2. **Load Sample Frame** - Click "Load Sample Frame" to generate test data
3. **Upload Image** - Click "Upload Image" to process your own images
4. **Toggle Mode** - Switch between raw and edge-detected views
5. **View Statistics** - Monitor frame count, processing time, and data usage

## 🧪 Technical Details

### OpenCV Processing Pipeline

```cpp
// 1. Convert RGBA to Grayscale
cvtColor(input, gray, COLOR_RGBA2GRAY);

// 2. Apply Gaussian Blur (noise reduction)
GaussianBlur(gray, gray, Size(5, 5), 1.5);

// 3. Canny Edge Detection
Canny(gray, edges, 50, 150);

// 4. Convert back to RGBA for display
cvtColor(edges, output, COLOR_GRAY2RGBA);
```

### OpenGL ES Rendering

- **Vertex Shader** - Full-screen quad positioning
- **Fragment Shader** - Texture sampling and display
- **Texture Format** - RGBA8888
- **Rendering Mode** - `RENDERMODE_WHEN_DIRTY` for efficiency

### JNI Interface

```kotlin
// Kotlin side
external fun processEdgeDetection(
    inputBitmap: Bitmap,
    outputBitmap: Bitmap
): Long

// C++ side
JNIEXPORT jlong JNICALL
Java_com_rnd_edgedetector_NativeProcessor_processEdgeDetection(
    JNIEnv* env,
    jobject obj,
    jobject inputBitmap,
    jobject outputBitmap
)
```

## 📊 Performance Metrics

| Device Type | Resolution | FPS | Processing Time |
|-------------|-----------|-----|-----------------|
| High-end    | 1280x720  | 25-30 | 10-15ms |
| Mid-range   | 1280x720  | 15-20 | 20-30ms |
| Low-end     | 640x480   | 10-15 | 40-50ms |

## 🔧 Troubleshooting

### Common Issues

#### NDK Build Fails
```bash
# Ensure NDK is properly installed
ls $ANDROID_HOME/ndk/

# Check CMake version
cmake --version  # Should be 3.22.1+
```

#### OpenCV Not Found
```bash
# Verify OpenCV path in local.properties
cat local.properties | grep opencv

# Check OpenCV libs exist
ls ~/opencv-android-sdk/sdk/native/libs/
```

#### Camera Permission Denied
- Go to Settings → Apps → Edge Detection Viewer → Permissions
- Enable Camera permission manually

#### Web Viewer Not Loading
```bash
# Rebuild TypeScript
cd web && npm run build

# Check for errors
npm run build 2>&1 | grep error
```

## 📝 Project Structure

```
EdgeDetectionViewer/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/rnd/edgedetector/
│   │       │   ├── MainActivity.kt
│   │       │   ├── NativeProcessor.kt
│   │       │   └── GLRenderer.kt
│   │       ├── cpp/
│   │       │   ├── native-processor.cpp
│   │       │   ├── edge_detector.cpp
│   │       │   └── CMakeLists.txt
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   └── values/
│   │       │       ├── strings.xml
│   │       │       └── themes.xml
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── web/
│   ├── src/
│   │   └── app.ts
│   ├── dist/
│   │   └── app.js
│   ├── index.html
│   ├── styles.css
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── screenshots/
├── build.gradle
├── settings.gradle
└── README.md
```

## 🎯 Key Features Checklist

- [x] Camera feed integration (Camera2 API)
- [x] OpenCV C++ processing via JNI
- [x] Canny edge detection implementation
- [x] OpenGL ES 2.0 rendering
- [x] Real-time performance (15+ FPS)
- [x] Toggle between raw/processed modes
- [x] FPS counter and processing time display
- [x] TypeScript web viewer
- [x] Frame statistics overlay
- [x] Modular project structure
- [x] Comprehensive documentation
- [x] Git version control with meaningful commits

## 🌟 Bonus Features Implemented

- ✅ **Toggle Button** - Switch between raw and edge-detected feed
- ✅ **FPS Counter** - Real-time frame rate monitoring
- ✅ **Processing Time Logger** - Performance metrics display
- ✅ **Multiple Edge Detection Algorithms** - Canny, Sobel, Laplacian
- ✅ **Web-based Frame Viewer** - TypeScript implementation
- ✅ **Responsive Web Design** - Modern gradient UI

## 🛠️ Technologies Used

| Component | Technology | Version |
|-----------|-----------|---------|
| Android SDK | Kotlin | 1.9.0 |
| Native Development | C++ | C++17 |
| Computer Vision | OpenCV | 4.8.0 |
| Graphics Rendering | OpenGL ES | 2.0 |
| Web Frontend | TypeScript | 5.2.2 |
| Build System | Gradle | 8.1.0 |
| Native Build | CMake | 3.22.1 |

## 📚 Learning Resources

- [OpenCV Android Documentation](https://docs.opencv.org/4.8.0/d5/df8/tutorial_dev_with_OCV_on_Android.html)
- [Android NDK Guide](https://developer.android.com/ndk/guides)
- [OpenGL ES 2.0 Tutorial](https://developer.android.com/training/graphics/opengl)
- [JNI Best Practices](https://developer.android.com/training/articles/perf-jni)

## 🤝 Contributing

This project was created as part of an R&D internship assessment. Feel free to fork and experiment!

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Created for Software Engineering Intern (R&D) Assessment

---

**Note**: This project demonstrates practical integration of Android, OpenCV, OpenGL, and TypeScript for real-time image processing applications. The focus is on architecture, integration, and performance rather than UI polish.
