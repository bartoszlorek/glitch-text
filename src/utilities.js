import aframe from './.utils/aframe.min'

export const animate = (duration, steps, callback) => {
    return aframe.setTaskout(callback, duration, steps)
}

export const repeat = (freq, variation, callback) => {
    return aframe.setRandval(callback, freq, variation)
}

export const stop = aframe.clear
