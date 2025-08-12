import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useResponsive } from '../hooks/useResponsive'

// Mock del hook useMediaQuery de Mantine
vi.mock('@mantine/hooks', () => ({
  useMediaQuery: vi.fn()
}))

import { useMediaQuery } from '@mantine/hooks'

describe('useResponsive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return mobile state when mobile breakpoint matches', () => {
    // Mock para mobile
    useMediaQuery.mockImplementation((query) => {
      if (query === '(max-width: 768px)') return true
      if (query === '(min-width: 769px) and (max-width: 1024px)') return false
      if (query === '(min-width: 1025px)') return false
      return false
    })

    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
  })

  it('should return tablet state when tablet breakpoint matches', () => {
    // Mock para tablet
    useMediaQuery.mockImplementation((query) => {
      if (query === '(max-width: 768px)') return false
      if (query === '(min-width: 769px) and (max-width: 1024px)') return true
      if (query === '(min-width: 1025px)') return false
      return false
    })

    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
    expect(result.current.isDesktop).toBe(false)
  })

  it('should return desktop state when desktop breakpoint matches', () => {
    // Mock para desktop
    useMediaQuery.mockImplementation((query) => {
      if (query === '(max-width: 768px)') return false
      if (query === '(min-width: 769px) and (max-width: 1024px)') return false
      if (query === '(min-width: 1025px)') return true
      return false
    })

    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(true)
  })

  describe('fontSize utility', () => {
    it('should return mobile fontSize when isMobile is true', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.fontSize('12px', '16px', '20px')).toBe('12px')
    })

    it('should return tablet fontSize when isTablet is true', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(min-width: 769px) and (max-width: 1024px)') return true
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.fontSize('12px', '16px', '20px')).toBe('16px')
    })

    it('should return desktop fontSize when isDesktop is true', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(min-width: 1025px)') return true
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.fontSize('12px', '16px', '20px')).toBe('20px')
    })

    it('should fallback to tablet fontSize when desktop is not provided', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(min-width: 1025px)') return true
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.fontSize('12px', '16px')).toBe('16px')
    })
  })

  describe('spacing utility', () => {
    it('should return mobile spacing when isMobile is true', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.spacing('8px', '16px')).toBe('8px')
    })

    it('should return desktop spacing when isMobile is false', () => {
      useMediaQuery.mockImplementation((query) => {
        if (query === '(max-width: 768px)') return false
        return false
      })

      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.spacing('8px', '16px')).toBe('16px')
    })
  })
}) 