package com.rnd.edgedetector

import android.graphics.Bitmap

/**
 * JNI interface for native OpenCV processing
 */
object NativeProcessor {
    
    init {
        System.loadLibrary("native-processor")
    }
    
    /**
     * Initialize native resources
     */
    external fun init(): Boolean
    
    /**
     * Process image with Canny edge detection
     * @param inputBitmap Input image
     * @param outputBitmap Output image (must be same size as input)
     * @return Processing time in milliseconds
     */
    external fun processEdgeDetection(
        inputBitmap: Bitmap,
        outputBitmap: Bitmap
    ): Long
    
    /**
     * Process image with grayscale filter
     * @param inputBitmap Input image
     * @param outputBitmap Output image (must be same size as input)
     * @return Processing time in milliseconds
     */
    external fun processGrayscale(
        inputBitmap: Bitmap,
        outputBitmap: Bitmap
    ): Long
    
    /**
     * Process raw image data (RGBA format)
     * @param width Image width
     * @param height Image height
     * @param inputData Input pixel data (RGBA)
     * @param outputData Output pixel data (RGBA)
     * @param applyEdgeDetection Whether to apply edge detection
     * @return Processing time in milliseconds
     */
    external fun processImageData(
        width: Int,
        height: Int,
        inputData: ByteArray,
        outputData: ByteArray,
        applyEdgeDetection: Boolean
    ): Long
    
    /**
     * Release native resources
     */
    external fun release()
    
    /**
     * Get OpenCV version string
     */
    external fun getOpenCVVersion(): String
}
