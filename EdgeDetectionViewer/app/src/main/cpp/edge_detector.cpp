#include <opencv2/opencv.hpp>
#include <opencv2/imgproc.hpp>
#include <android/log.h>

#define LOG_TAG "EdgeDetector"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

using namespace cv;

/**
 * Advanced edge detection with multiple algorithms
 */
class EdgeDetector {
public:
    enum Algorithm {
        CANNY,
        SOBEL,
        LAPLACIAN
    };
    
    static void detectEdges(const Mat& input, Mat& output, Algorithm algo = CANNY) {
        Mat gray;
        
        // Convert to grayscale if needed
        if (input.channels() == 4) {
            cvtColor(input, gray, COLOR_RGBA2GRAY);
        } else if (input.channels() == 3) {
            cvtColor(input, gray, COLOR_RGB2GRAY);
        } else {
            gray = input.clone();
        }
        
        // Apply noise reduction
        GaussianBlur(gray, gray, Size(5, 5), 1.5);
        
        Mat edges;
        
        switch (algo) {
            case CANNY:
                Canny(gray, edges, 50, 150, 3);
                break;
                
            case SOBEL: {
                Mat grad_x, grad_y;
                Mat abs_grad_x, abs_grad_y;
                
                Sobel(gray, grad_x, CV_16S, 1, 0, 3);
                Sobel(gray, grad_y, CV_16S, 0, 1, 3);
                
                convertScaleAbs(grad_x, abs_grad_x);
                convertScaleAbs(grad_y, abs_grad_y);
                
                addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, edges);
                break;
            }
                
            case LAPLACIAN:
                Laplacian(gray, edges, CV_16S, 3);
                convertScaleAbs(edges, edges);
                break;
        }
        
        // Convert back to RGBA
        if (input.channels() == 4) {
            cvtColor(edges, output, COLOR_GRAY2RGBA);
        } else if (input.channels() == 3) {
            cvtColor(edges, output, COLOR_GRAY2RGB);
        } else {
            output = edges;
        }
    }
    
    static void enhanceEdges(Mat& edges) {
        // Apply morphological operations to enhance edges
        Mat kernel = getStructuringElement(MORPH_RECT, Size(3, 3));
        morphologyEx(edges, edges, MORPH_CLOSE, kernel);
    }
};
