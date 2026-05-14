cmake_minimum_required(VERSION 3.20)

project(WEB_SYNTH CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# RD_DSP submodule — pure DSP, cross-compiled to wasm. Disable its native
# Catch2 tests + CLI demo before add_subdirectory so wasm build doesn't fetch
# Catch2 or build the standalone exe. See .claude/rd_dsp_integration_plan.md §1.
set(BUILD_TESTS      OFF CACHE BOOL "" FORCE)
set(BUILD_STANDALONE OFF CACHE BOOL "" FORCE)
add_subdirectory(SUBMODULES/RD_DSP)

# Each ENGINE/<MODULE> defines its own wasm executable target.
# Per-module source lists live in CMAKE/<MODULE>_SOURCES.cmake (regenSource.py).
add_subdirectory(ENGINE/SYNTH)
add_subdirectory(ENGINE/PULSAR)
