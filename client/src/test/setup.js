import '@testing-library/jest-dom'

// Mock for Three.js and WebGL
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this)
  }
  unobserve() {}
  disconnect() {}
}

// Mock WebGL context
HTMLCanvasElement.prototype.getContext = function(contextId) {
  if (contextId === 'webgl' || contextId === 'webgl2') {
    return {
      canvas: this,
      drawingBufferWidth: 300,
      drawingBufferHeight: 150,
      getExtension: () => null,
      getParameter: () => null,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      useProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      clearColor: () => {},
      clear: () => {},
      drawArrays: () => {},
      flush: () => {},
      getShaderParameter: () => true,
      getProgramParameter: () => true,
    }
  }
  return null
} 