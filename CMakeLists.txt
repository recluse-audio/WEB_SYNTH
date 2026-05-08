cmake_minimum_required(VERSION 3.20)

project(WEB_SYNTH CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Each ENGINE/<MODULE> defines its own wasm executable target.
# Per-module source lists live in CMAKE/<MODULE>_SOURCES.cmake (regenSource.py).
add_subdirectory(ENGINE/SINE)
