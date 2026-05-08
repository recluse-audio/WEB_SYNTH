include(${CMAKE_SOURCE_DIR}/CMAKE/SYNTH_SOURCES.cmake)

add_executable(synth ${SYNTH_SOURCES})

# Pulls SUBMODULES/RD_DSP/libRD_DSP.a into the wasm. RD_DSP propagates
# its PUBLIC include dir (SOURCE/), so synth.cpp can #include "OSCILLATOR/Oscillator.h".
target_link_libraries(synth PRIVATE RD_DSP)

if(EMSCRIPTEN)
    set_target_properties(synth PROPERTIES SUFFIX ".wasm")

    target_link_options(synth PRIVATE
        "-sWASM=1"
        "-sSTANDALONE_WASM=1"
        "-sEXPORTED_FUNCTIONS=[_synth_prepare,_synth_set_freq,_synth_start,_synth_stop,_synth_process,_synth_get_output_buf]"
        "--no-entry"
    )

    target_compile_options(synth PRIVATE -O3)

    add_custom_command(TARGET synth POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_SOURCE_DIR}/PUBLIC
        COMMAND ${CMAKE_COMMAND} -E copy
            $<TARGET_FILE:synth>
            ${CMAKE_SOURCE_DIR}/PUBLIC/synth.wasm
        COMMENT "Copying synth.wasm to PUBLIC/"
    )
endif()
