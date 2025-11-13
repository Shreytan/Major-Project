#include <jni.h>
#include <android/log.h>
#include <android/bitmap.h>
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc.hpp>
#include <string>
#include <chrono>

#define LOG_TAG "NativeProcessor"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

using namespace cv;
using namespace std;

// Helper function to convert Android Bitmap to cv::Mat
bool bitmapToMat(JNIEnv* env, jobject bitmap, Mat& mat) {
    AndroidBitmapInfo info;
    void* pixels = nullptr;
    
    if (AndroidBitmap_getInfo(env, bitmap, &info) < 0) {
        LOGE("Failed to get bitmap info");
        return false;
    }
    
    if (info.format != ANDROID_BITMAP_FORMAT_RGBA_8888) {
        LOGE("Bitmap format is not RGBA_8888");
        return false;
    }
    
    if (AndroidBitmap_lockPixels(env, bitmap, &pixels) < 0) {
        LOGE("Failed to lock bitmap pixels");
        return false;
    }
    
    mat = Mat(info.height, info.width, CV_8UC4, pixels);
    
    return true;
}

// Helper function to unlock bitmap
void unlockBitmap(JNIEnv* env, jobject bitmap) {
    AndroidBitmap_unlockPixels(env, bitmap);
}

// Apply Canny edge detection
void applyCannyEdgeDetection(const Mat& input, Mat& output) {
    Mat gray, edges;
    
    // Convert to grayscale
    cvtColor(input, gray, COLOR_RGBA2GRAY);
    
    // Apply Gaussian blur to reduce noise
    GaussianBlur(gray, gray, Size(5, 5), 1.5);
    
    // Apply Canny edge detection
    Canny(gray, edges, 50, 150);
    
    // Convert back to RGBA
    cvtColor(edges, output, COLOR_GRAY2RGBA);
}

// Apply grayscale filter
void applyGrayscale(const Mat& input, Mat& output) {
    Mat gray;
    cvtColor(input, gray, COLOR_RGBA2GRAY);
    cvtColor(gray, output, COLOR_GRAY2RGBA);
}

extern "C" {

JNIEXPORT jboolean JNICALL
Java_com_rnd_edgedetector_NativeProcessor_init(JNIEnv* env, jobject /* this */) {
    LOGI("Native processor initialized");
    LOGI("OpenCV version: %s", CV_VERSION);
    return JNI_TRUE;
}

JNIEXPORT jlong JNICALL
Java_com_rnd_edgedetector_NativeProcessor_processEdgeDetection(
        JNIEnv* env,
        jobject /* this */,
        jobject inputBitmap,
        jobject outputBitmap) {
    
    auto startTime = chrono::high_resolution_clock::now();
    
    Mat inputMat, outputMat;
    
    // Convert input bitmap to Mat
    if (!bitmapToMat(env, inputBitmap, inputMat)) {
        LOGE("Failed to convert input bitmap to Mat");
        return -1;
    }
    
    // Process image
    try {
        applyCannyEdgeDetection(inputMat, outputMat);
    } catch (const exception& e) {
        LOGE("Error processing image: %s", e.what());
        unlockBitmap(env, inputBitmap);
        return -1;
    }
    
    // Convert output Mat to bitmap
    Mat outputBitmapMat;
    if (!bitmapToMat(env, outputBitmap, outputBitmapMat)) {
        LOGE("Failed to convert output bitmap to Mat");
        unlockBitmap(env, inputBitmap);
        return -1;
    }
    
    outputMat.copyTo(outputBitmapMat);
    
    // Unlock bitmaps
    unlockBitmap(env, inputBitmap);
    unlockBitmap(env, outputBitmap);
    
    auto endTime = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
    
    return duration.count();
}

JNIEXPORT jlong JNICALL
Java_com_rnd_edgedetector_NativeProcessor_processGrayscale(
        JNIEnv* env,
        jobject /* this */,
        jobject inputBitmap,
        jobject outputBitmap) {
    
    auto startTime = chrono::high_resolution_clock::now();
    
    Mat inputMat, outputMat;
    
    if (!bitmapToMat(env, inputBitmap, inputMat)) {
        LOGE("Failed to convert input bitmap to Mat");
        return -1;
    }
    
    try {
        applyGrayscale(inputMat, outputMat);
    } catch (const exception& e) {
        LOGE("Error processing image: %s", e.what());
        unlockBitmap(env, inputBitmap);
        return -1;
    }
    
    Mat outputBitmapMat;
    if (!bitmapToMat(env, outputBitmap, outputBitmapMat)) {
        LOGE("Failed to convert output bitmap to Mat");
        unlockBitmap(env, inputBitmap);
        return -1;
    }
    
    outputMat.copyTo(outputBitmapMat);
    
    unlockBitmap(env, inputBitmap);
    unlockBitmap(env, outputBitmap);
    
    auto endTime = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
    
    return duration.count();
}

JNIEXPORT jlong JNICALL
Java_com_rnd_edgedetector_NativeProcessor_processImageData(
        JNIEnv* env,
        jobject /* this */,
        jint width,
        jint height,
        jbyteArray inputData,
        jbyteArray outputData,
        jboolean applyEdgeDetection) {
    
    auto startTime = chrono::high_resolution_clock::now();
    
    // Get input data
    jbyte* inputBytes = env->GetByteArrayElements(inputData, nullptr);
    jbyte* outputBytes = env->GetByteArrayElements(outputData, nullptr);
    
    if (!inputBytes || !outputBytes) {
        LOGE("Failed to get byte array elements");
        return -1;
    }
    
    // Create Mat from raw data
    Mat inputMat(height, width, CV_8UC4, inputBytes);
    Mat outputMat;
    
    try {
        if (applyEdgeDetection) {
            applyCannyEdgeDetection(inputMat, outputMat);
        } else {
            inputMat.copyTo(outputMat);
        }
        
        // Copy output data
        memcpy(outputBytes, outputMat.data, width * height * 4);
        
    } catch (const exception& e) {
        LOGE("Error processing image data: %s", e.what());
        env->ReleaseByteArrayElements(inputData, inputBytes, 0);
        env->ReleaseByteArrayElements(outputData, outputBytes, 0);
        return -1;
    }
    
    env->ReleaseByteArrayElements(inputData, inputBytes, 0);
    env->ReleaseByteArrayElements(outputData, outputBytes, 0);
    
    auto endTime = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
    
    return duration.count();
}

JNIEXPORT void JNICALL
Java_com_rnd_edgedetector_NativeProcessor_release(JNIEnv* env, jobject /* this */) {
    LOGI("Native processor released");
}

JNIEXPORT jstring JNICALL
Java_com_rnd_edgedetector_NativeProcessor_getOpenCVVersion(JNIEnv* env, jobject /* this */) {
    return env->NewStringUTF(CV_VERSION);
}

} // extern "C"
