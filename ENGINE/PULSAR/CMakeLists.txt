include(${CMAKE_SOURCE_DIR}/CMAKE/PULSAR_SOURCES.cmake)

add_executable(pulsar ${PULSAR_SOURCES})

target_link_libraries(pulsar PRIVATE RD_DSP)

if(EMSCRIPTEN)
    set_target_properties(pulsar PROPERTIES SUFFIX ".wasm")

    target_link_options(pulsar PRIVATE
        "-sWASM=1"
        "-sSTANDALONE_WASM=1"
        "-sEXPORTED_FUNCTIONS=[_pulsar_prepare,_pulsar_set_emission_rate,_pulsar_set_formant_freq,_pulsar_set_wave_position,_pulsar_set_gain,_pulsar_set_emission_range,_pulsar_set_emission_density,_pulsar_set_formant_range,_pulsar_set_formant_density,_pulsar_start,_pulsar_stop,_pulsar_process,_pulsar_get_output_buf,_pulsar_display_buf_ptr,_pulsar_display_buf_size,_pulsar_fill_display_buf,_pulsar_is_active,_pulsar_consume_flash]"
        "--no-entry"
    )

    target_compile_options(pulsar PRIVATE -O3)

    add_custom_command(TARGET pulsar POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_SOURCE_DIR}/PUBLIC
        COMMAND ${CMAKE_COMMAND} -E copy
            $<TARGET_FILE:pulsar>
            ${CMAKE_SOURCE_DIR}/PUBLIC/pulsar.wasm
        COMMENT "Copying pulsar.wasm to PUBLIC/"
    )
endif()
