include(${CMAKE_SOURCE_DIR}/CMAKE/SINE_SOURCES.cmake)

add_executable(sine ${SINE_SOURCES})

if(EMSCRIPTEN)
    set_target_properties(sine PROPERTIES SUFFIX ".wasm")

    target_link_options(sine PRIVATE
        "-sWASM=1"
        "-sSTANDALONE_WASM=1"
        "-sEXPORTED_FUNCTIONS=[_add]"
        "--no-entry"
    )

    target_compile_options(sine PRIVATE -O3)

    add_custom_command(TARGET sine POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_SOURCE_DIR}/PUBLIC
        COMMAND ${CMAKE_COMMAND} -E copy
            $<TARGET_FILE:sine>
            ${CMAKE_SOURCE_DIR}/PUBLIC/sine.wasm
        COMMENT "Copying sine.wasm to PUBLIC/"
    )
endif()
