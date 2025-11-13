# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep OpenCV classes
-keep class org.opencv.** { *; }

# Keep JNI interface
-keep class com.rnd.edgedetector.NativeProcessor { *; }

# Keep GLRenderer
-keep class com.rnd.edgedetector.GLRenderer { *; }

# Keep MainActivity
-keep class com.rnd.edgedetector.MainActivity { *; }
