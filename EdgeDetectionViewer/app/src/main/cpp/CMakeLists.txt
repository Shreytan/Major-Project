cmake_minimum_required(VERSION 3.22.1)

project("native-processor")

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find OpenCV package
find_package(OpenCV REQUIRED)

# Add source files
add_library(native-processor SHARED
        native-processor.cpp
        edge_detector.cpp
)

# Include directories
target_include_directories(native-processor PRIVATE
        ${OpenCV_INCLUDE_DIRS}
)

# Link libraries
target_link_libraries(native-processor
        android
        log
        jnigraphics
        ${OpenCV_LIBS}
        GLESv2
        EGL
)
