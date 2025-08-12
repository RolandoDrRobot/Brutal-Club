import { describe, it, expect } from 'vitest'
import { BREAKPOINTS, CHARACTER_MODELS, THEME } from '../utils/constants'

describe('Constants', () => {
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe('(max-width: 768px)')
      expect(BREAKPOINTS.tablet).toBe('(min-width: 769px) and (max-width: 1024px)')
      expect(BREAKPOINTS.desktop).toBe('(min-width: 1025px)')
    })

    it('should have all required breakpoints', () => {
      expect(BREAKPOINTS).toHaveProperty('mobile')
      expect(BREAKPOINTS).toHaveProperty('tablet')
      expect(BREAKPOINTS).toHaveProperty('desktop')
    })
  })

  describe('CHARACTER_MODELS', () => {
    it('should have paths for all characters', () => {
      expect(CHARACTER_MODELS.paths).toHaveProperty('PETE')
      expect(CHARACTER_MODELS.paths).toHaveProperty('TYLER')
      expect(CHARACTER_MODELS.paths).toHaveProperty('MARLA')
    })

    it('should have correct model paths', () => {
      expect(CHARACTER_MODELS.paths.PETE).toBe('./models/pete.glb')
      expect(CHARACTER_MODELS.paths.TYLER).toBe('./models/Tyler.glb')
      expect(CHARACTER_MODELS.paths.MARLA).toBe('./models/woman.gltf')
    })

    it('should have component mappings', () => {
      expect(CHARACTER_MODELS.components.pete).toBe('Pete')
      expect(CHARACTER_MODELS.components.tyler).toBe('Tyler')
      expect(CHARACTER_MODELS.components.vince).toBe('Tyler')
      expect(CHARACTER_MODELS.components.bob).toBe('Pete')
    })
  })

  describe('THEME', () => {
    it('should have all color properties', () => {
      expect(THEME.colors).toHaveProperty('primary')
      expect(THEME.colors).toHaveProperty('gold')
      expect(THEME.colors).toHaveProperty('white')
      expect(THEME.colors).toHaveProperty('black')
    })

    it('should have correct primary color', () => {
      expect(THEME.colors.primary).toBe('#fc3f31')
    })

    it('should have shadows defined', () => {
      expect(THEME.shadows).toHaveProperty('neon')
      expect(THEME.shadows).toHaveProperty('button')
      expect(THEME.shadows.neon).toContain('#fc3f31')
    })

    it('should have font configuration', () => {
      expect(THEME.fonts).toHaveProperty('primary')
      expect(THEME.fonts.primary).toContain('Anton')
    })
  })
}) 