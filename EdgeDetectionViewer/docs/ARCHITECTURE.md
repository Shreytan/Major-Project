# Architecture Documentation

## System Design

### Overview
The Edge Detection Viewer is built using a multi-layered architecture that separates concerns between UI, processing, and rendering.

### Layers

#### 1. Presentation Layer (Kotlin)
- **MainActivity**: Manages UI, camera permissions, and user interactions
- **GLRenderer**: Handles OpenGL ES rendering pipeline
- Responsibilities:
  - Camera lifecycle management
  - Permission handling
  - UI updates and user feedback
  - OpenGL context management

#### 2. Native Processing Layer (C++)
- **native-processor.cpp**: JNI bridge between Java and C++
- **edge_detector.cpp**: OpenCV algorithm implementations
- Responsibilities:
  - Image format conversion (RGBA ↔ Grayscale)
  - Edge detection algorithms (Canny, Sobel, Laplacian)
  - Performance optimization
  - Memory management

#### 3. Rendering Layer (OpenGL ES)
- **Vertex Shader**: Positions full-screen quad
- **Fragment Shader**: Samples and displays texture
- Responsibilities:
  - Hardware-accelerated rendering
  - Texture management
  - Frame buffer operations

### Data Flow

```
Camera → SurfaceTexture → JNI → OpenCV → JNI → OpenGL → Display
```

1. **Capture**: Camera2 API captures frames to SurfaceTexture
2. **Transfer**: Frame data transferred to native layer via JNI
3. **Process**: OpenCV applies edge detection in C++
4. **Return**: Processed data returned to Java layer
5. **Render**: OpenGL ES renders processed frame as texture
6. **Display**: GLSurfaceView displays final output

### Threading Model

- **Main Thread**: UI updates, user interactions
- **Camera Thread**: Camera operations (HandlerThread)
- **GL Thread**: OpenGL rendering operations
- **Native Thread**: OpenCV processing (called from camera thread)

### Memory Management

- **Bitmap Pooling**: Reuse bitmap objects to reduce GC pressure
- **Native Memory**: OpenCV Mat objects managed in C++
- **Texture Caching**: OpenGL textures reused across frames

## Performance Considerations

### Optimization Techniques

1. **Frame Skipping**: Process every Nth frame if performance drops
2. **Resolution Scaling**: Reduce processing resolution for better FPS
3. **Algorithm Selection**: Choose faster algorithms for low-end devices
4. **Memory Reuse**: Minimize allocations in hot paths

### Bottlenecks

- **JNI Overhead**: Minimize data transfer between Java and C++
- **OpenCV Processing**: Most CPU-intensive operation
- **Texture Upload**: GPU memory bandwidth limitation

## Web Viewer Architecture

### Components

- **app.ts**: Main application logic
- **Canvas API**: Frame rendering
- **DOM Manipulation**: Statistics updates

### Features

- Base64 image decoding
- Client-side edge detection simulation
- Real-time statistics tracking
- Responsive layout

## Future Enhancements

1. **GPU Acceleration**: Use OpenGL compute shaders for processing
2. **Multiple Cameras**: Support front/back camera switching
3. **Video Recording**: Save processed video output
4. **WebSocket Integration**: Stream frames to web viewer in real-time
5. **ML Integration**: Add TensorFlow Lite for advanced processing
