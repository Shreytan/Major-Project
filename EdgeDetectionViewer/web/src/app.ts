/**
 * Edge Detection Web Viewer
 * TypeScript-based web interface for displaying processed frames
 */

interface FrameStats {
    fps: number;
    resolution: { width: number; height: number };
    processingTime: number;
    mode: string;
}

interface ProcessingStats {
    frameCount: number;
    totalProcessingTime: number;
    totalDataProcessed: number;
}

class EdgeDetectionViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stats: ProcessingStats;
    private currentMode: 'raw' | 'edge' = 'edge';
    
    // DOM elements
    private fpsElement: HTMLElement;
    private resolutionElement: HTMLElement;
    private processingElement: HTMLElement;
    private modeElement: HTMLElement;
    private frameCountElement: HTMLElement;
    private avgProcessingElement: HTMLElement;
    private totalDataElement: HTMLElement;
    private statusElement: HTMLElement;
    
    constructor() {
        this.canvas = document.getElementById('frameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.stats = {
            frameCount: 0,
            totalProcessingTime: 0,
            totalDataProcessed: 0
        };
        
        // Initialize DOM elements
        this.fpsElement = document.getElementById('fpsValue')!;
        this.resolutionElement = document.getElementById('resolutionValue')!;
        this.processingElement = document.getElementById('processingValue')!;
        this.modeElement = document.getElementById('modeValue')!;
        this.frameCountElement = document.getElementById('frameCount')!;
        this.avgProcessingElement = document.getElementById('avgProcessing')!;
        this.totalDataElement = document.getElementById('totalData')!;
        this.statusElement = document.getElementById('status')!;
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.loadSampleFrame();
    }
    
    private initializeCanvas(): void {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.drawPlaceholder();
    }
    
    private drawPlaceholder(): void {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Waiting for frame data...',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }
    
    private setupEventListeners(): void {
        const loadSampleBtn = document.getElementById('loadSampleBtn')!;
        const toggleModeBtn = document.getElementById('toggleModeBtn')!;
        const uploadBtn = document.getElementById('uploadBtn')!;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        
        loadSampleBtn.addEventListener('click', () => this.loadSampleFrame());
        toggleModeBtn.addEventListener('click', () => this.toggleMode());
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }
    
    private loadSampleFrame(): void {
        // Generate a sample edge-detected frame
        this.statusElement.textContent = 'Processing...';
        this.statusElement.style.color = '#f59e0b';
        
        setTimeout(() => {
            this.generateSampleEdgeFrame();
            this.updateStats({
                fps: 30,
                resolution: { width: 1280, height: 720 },
                processingTime: 15,
                mode: this.currentMode === 'edge' ? 'Edge Detection' : 'Raw Feed'
            });
            
            this.stats.frameCount++;
            this.stats.totalProcessingTime += 15;
            this.stats.totalDataProcessed += (1280 * 720 * 4) / (1024 * 1024);
            
            this.updateProcessingStats();
            this.statusElement.textContent = 'Active';
            this.statusElement.style.color = '#10b981';
        }, 500);
    }
    
    private generateSampleEdgeFrame(): void {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        if (this.currentMode === 'edge') {
            // Generate edge-detected pattern
            for (let y = 0; y < this.canvas.height; y++) {
                for (let x = 0; x < this.canvas.width; x++) {
                    const idx = (y * this.canvas.width + x) * 4;
                    
                    // Create edge-like pattern
                    const edge = (
                        Math.sin(x / 50) * Math.cos(y / 50) +
                        Math.sin((x + y) / 100)
                    ) > 0.7 ? 255 : 0;
                    
                    data[idx] = edge;     // R
                    data[idx + 1] = edge; // G
                    data[idx + 2] = edge; // B
                    data[idx + 3] = 255;  // A
                }
            }
        } else {
            // Generate raw camera-like pattern
            for (let y = 0; y < this.canvas.height; y++) {
                for (let x = 0; x < this.canvas.width; x++) {
                    const idx = (y * this.canvas.width + x) * 4;
                    
                    const noise = Math.random() * 50;
                    const gradient = (x / this.canvas.width) * 255;
                    
                    data[idx] = gradient + noise;     // R
                    data[idx + 1] = gradient + noise; // G
                    data[idx + 2] = gradient + noise; // B
                    data[idx + 3] = 255;              // A
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    private toggleMode(): void {
        this.currentMode = this.currentMode === 'edge' ? 'raw' : 'edge';
        this.loadSampleFrame();
    }
    
    private handleFileUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (!file) return;
        
        this.statusElement.textContent = 'Loading...';
        this.statusElement.style.color = '#f59e0b';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);
                
                if (this.currentMode === 'edge') {
                    this.applyEdgeDetection();
                }
                
                this.updateStats({
                    fps: 0,
                    resolution: { width: img.width, height: img.height },
                    processingTime: 0,
                    mode: this.currentMode === 'edge' ? 'Edge Detection' : 'Raw Feed'
                });
                
                this.stats.frameCount++;
                this.updateProcessingStats();
                this.statusElement.textContent = 'Active';
                this.statusElement.style.color = '#10b981';
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
    
    private applyEdgeDetection(): void {
        // Simple edge detection using canvas
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Convert to grayscale and apply simple edge detection
        const gray = new Uint8Array(width * height);
        
        for (let i = 0; i < data.length; i += 4) {
            gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        
        // Sobel operator
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                
                const gx = 
                    -gray[idx - width - 1] - 2 * gray[idx - 1] - gray[idx + width - 1] +
                    gray[idx - width + 1] + 2 * gray[idx + 1] + gray[idx + width + 1];
                
                const gy = 
                    -gray[idx - width - 1] - 2 * gray[idx - width] - gray[idx - width + 1] +
                    gray[idx + width - 1] + 2 * gray[idx + width] + gray[idx + width + 1];
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                const edge = magnitude > 50 ? 255 : 0;
                
                const pixelIdx = idx * 4;
                data[pixelIdx] = edge;
                data[pixelIdx + 1] = edge;
                data[pixelIdx + 2] = edge;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    private updateStats(frameStats: FrameStats): void {
        this.fpsElement.textContent = frameStats.fps.toString();
        this.resolutionElement.textContent = 
            `${frameStats.resolution.width}x${frameStats.resolution.height}`;
        this.processingElement.textContent = `${frameStats.processingTime} ms`;
        this.modeElement.textContent = frameStats.mode;
    }
    
    private updateProcessingStats(): void {
        this.frameCountElement.textContent = this.stats.frameCount.toString();
        
        const avgProcessing = this.stats.frameCount > 0
            ? Math.round(this.stats.totalProcessingTime / this.stats.frameCount)
            : 0;
        this.avgProcessingElement.textContent = `${avgProcessing} ms`;
        
        this.totalDataElement.textContent = 
            `${this.stats.totalDataProcessed.toFixed(2)} MB`;
    }
}

// Initialize the viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EdgeDetectionViewer();
    console.log('Edge Detection Viewer initialized');
});

export { EdgeDetectionViewer };
