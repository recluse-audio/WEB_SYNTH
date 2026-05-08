// ENGINE/SINE/sine.cpp
// POC stub. Inc 1: prove emcc → wasm pipeline end-to-end.
// Real DSP arrives in Inc 2.

extern "C" float add(float a, float b)
{
    return a + b;
}
