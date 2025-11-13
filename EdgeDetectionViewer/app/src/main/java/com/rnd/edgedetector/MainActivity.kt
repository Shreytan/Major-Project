package com.rnd.edgedetector

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.SurfaceTexture
import android.hardware.camera2.*
import android.opengl.GLSurfaceView
import android.os.Bundle
import android.os.Handler
import android.os.HandlerThread
import android.util.Log
import android.util.Size
import android.view.Surface
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.rnd.edgedetector.databinding.ActivityMainBinding
import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var glRenderer: GLRenderer
    private var cameraDevice: CameraDevice? = null
    private var captureSession: CameraCaptureSession? = null
    private var backgroundThread: HandlerThread? = null
    private var backgroundHandler: Handler? = null
    private val cameraOpenCloseLock = Semaphore(1)
    
    private var isProcessingEnabled = false
    private var frameCount = 0
    private var lastFpsTime = System.currentTimeMillis()
    private var currentFps = 0
    
    companion object {
        private const val TAG = "EdgeDetector"
        private const val CAMERA_PERMISSION_REQUEST = 100
        private const val CAMERA_ID = "0"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize native library
        NativeProcessor.init()
        
        setupGLSurfaceView()
        setupControls()
        
        if (checkCameraPermission()) {
            startBackgroundThread()
            openCamera()
        } else {
            requestCameraPermission()
        }
    }
    
    private fun setupGLSurfaceView() {
        binding.glSurfaceView.setEGLContextClientVersion(2)
        glRenderer = GLRenderer(this)
        binding.glSurfaceView.setRenderer(glRenderer)
        binding.glSurfaceView.renderMode = GLSurfaceView.RENDERMODE_WHEN_DIRTY
    }
    
    private fun setupControls() {
        binding.toggleButton.setOnClickListener {
            isProcessingEnabled = !isProcessingEnabled
            val mode = if (isProcessingEnabled) "Edge Detection" else "Raw"
            binding.modeText.text = "Mode: $mode"
            Toast.makeText(this, mode, Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun checkCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
    }
    
    private fun requestCameraPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.CAMERA),
            CAMERA_PERMISSION_REQUEST
        )
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startBackgroundThread()
                openCamera()
            } else {
                Toast.makeText(this, R.string.camera_permission_required, Toast.LENGTH_LONG).show()
                finish()
            }
        }
    }
    
    private fun startBackgroundThread() {
        backgroundThread = HandlerThread("CameraBackground").also { it.start() }
        backgroundHandler = Handler(backgroundThread!!.looper)
    }
    
    private fun stopBackgroundThread() {
        backgroundThread?.quitSafely()
        try {
            backgroundThread?.join()
            backgroundThread = null
            backgroundHandler = null
        } catch (e: InterruptedException) {
            Log.e(TAG, "Error stopping background thread", e)
        }
    }
    
    private fun openCamera() {
        val manager = getSystemService(CAMERA_SERVICE) as CameraManager
        try {
            if (!cameraOpenCloseLock.tryAcquire(2500, TimeUnit.MILLISECONDS)) {
                throw RuntimeException("Time out waiting to lock camera opening.")
            }
            
            if (ActivityCompat.checkSelfPermission(
                    this, Manifest.permission.CAMERA
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                return
            }
            
            manager.openCamera(CAMERA_ID, object : CameraDevice.StateCallback() {
                override fun onOpened(camera: CameraDevice) {
                    cameraOpenCloseLock.release()
                    cameraDevice = camera
                    createCameraPreviewSession()
                }
                
                override fun onDisconnected(camera: CameraDevice) {
                    cameraOpenCloseLock.release()
                    camera.close()
                    cameraDevice = null
                }
                
                override fun onError(camera: CameraDevice, error: Int) {
                    cameraOpenCloseLock.release()
                    camera.close()
                    cameraDevice = null
                    Log.e(TAG, "Camera error: $error")
                }
            }, backgroundHandler)
            
        } catch (e: Exception) {
            Log.e(TAG, "Error opening camera", e)
        }
    }
    
    private fun createCameraPreviewSession() {
        try {
            val texture = glRenderer.getSurfaceTexture()
            texture.setDefaultBufferSize(1280, 720)
            
            val surface = Surface(texture)
            
            val captureRequestBuilder = cameraDevice!!.createCaptureRequest(
                CameraDevice.TEMPLATE_PREVIEW
            ).apply {
                addTarget(surface)
                set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE)
                set(CaptureRequest.CONTROL_AE_MODE, CaptureRequest.CONTROL_AE_MODE_ON)
            }
            
            cameraDevice!!.createCaptureSession(
                listOf(surface),
                object : CameraCaptureSession.StateCallback() {
                    override fun onConfigured(session: CameraCaptureSession) {
                        if (cameraDevice == null) return
                        
                        captureSession = session
                        try {
                            session.setRepeatingRequest(
                                captureRequestBuilder.build(),
                                object : CameraCaptureSession.CaptureCallback() {
                                    override fun onCaptureCompleted(
                                        session: CameraCaptureSession,
                                        request: CaptureRequest,
                                        result: TotalCaptureResult
                                    ) {
                                        processFrame()
                                    }
                                },
                                backgroundHandler
                            )
                        } catch (e: Exception) {
                            Log.e(TAG, "Error starting preview", e)
                        }
                    }
                    
                    override fun onConfigureFailed(session: CameraCaptureSession) {
                        Log.e(TAG, "Failed to configure camera")
                    }
                },
                backgroundHandler
            )
            
        } catch (e: Exception) {
            Log.e(TAG, "Error creating camera preview session", e)
        }
    }
    
    private fun processFrame() {
        val startTime = System.currentTimeMillis()
        
        glRenderer.updateTexture(isProcessingEnabled)
        binding.glSurfaceView.requestRender()
        
        val processingTime = System.currentTimeMillis() - startTime
        
        // Update FPS
        frameCount++
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastFpsTime >= 1000) {
            currentFps = frameCount
            frameCount = 0
            lastFpsTime = currentTime
            
            runOnUiThread {
                binding.fpsText.text = getString(R.string.fps_label, currentFps)
                binding.processingTimeText.text = getString(R.string.processing_time, processingTime)
            }
        }
    }
    
    private fun closeCamera() {
        try {
            cameraOpenCloseLock.acquire()
            captureSession?.close()
            captureSession = null
            cameraDevice?.close()
            cameraDevice = null
        } catch (e: InterruptedException) {
            Log.e(TAG, "Error closing camera", e)
        } finally {
            cameraOpenCloseLock.release()
        }
    }
    
    override fun onPause() {
        closeCamera()
        stopBackgroundThread()
        super.onPause()
    }
    
    override fun onResume() {
        super.onResume()
        if (checkCameraPermission()) {
            startBackgroundThread()
            openCamera()
        }
    }
    
    override fun onDestroy() {
        NativeProcessor.release()
        super.onDestroy()
    }
}
