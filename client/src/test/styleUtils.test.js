import { describe, it, expect } from 'vitest'
import { getButtonStyle, getCharacterCardStyle } from '../utils/styleUtils'
import { THEME } from '../utils/constants'

describe('StyleUtils', () => {
  describe('getButtonStyle', () => {
    const mockCharacter = {
      name: 'Tyler',
      isPurchased: false,
      price: 1000,
      canAfford: true,
      isLocked: false
    }

    it('should return base button style for shop character', () => {
      const style = getButtonStyle(mockCharacter)
      
      expect(style).toMatchObject({
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: 'none',
        fontWeight: 700,
        borderRadius: '8px',
        textTransform: 'uppercase',
        fontFamily: THEME.fonts.primary
      })
    })

    it('should return mobile styles when isMobile is true', () => {
      const style = getButtonStyle(mockCharacter, { isMobile: true })
      
      expect(style.fontSize).toBe('16px')
    })

    it('should return desktop styles when isMobile is false', () => {
      const style = getButtonStyle(mockCharacter, { isMobile: false })
      
      expect(style.fontSize).toBe('18px')
    })

    it('should handle purchased character in shop', () => {
      const purchasedCharacter = { ...mockCharacter, isPurchased: true }
      const style = getButtonStyle(purchasedCharacter)
      
      expect(style.color).toBe(THEME.colors.gold)
      expect(style.cursor).toBe('default')
    })

    it('should handle locked character in shop', () => {
      const lockedCharacter = { 
        ...mockCharacter, 
        price: 1000,
        canAfford: false,
        isPurchased: false 
      }
      const style = getButtonStyle(lockedCharacter)
      
      expect(style.color).toBe(THEME.colors.gray)
      expect(style.cursor).toBe('not-allowed')
    })

    it('should handle opponent button styling', () => {
      const style = getButtonStyle(mockCharacter, { isOpponent: true })
      
      expect(style.letterSpacing).toBe('1px')
      expect(style.padding).toBe('8px 12px')
      expect(style.minHeight).toBe('36px')
      expect(style.color).toBe(THEME.colors.primary)
      expect(style.cursor).toBe('pointer')
    })

    it('should handle locked opponent', () => {
      const lockedOpponent = { ...mockCharacter, isLocked: true }
      const style = getButtonStyle(lockedOpponent, { isOpponent: true })
      
      expect(style.color).toBe(THEME.colors.gray)
      expect(style.cursor).toBe('not-allowed')
    })
  })

  describe('getCharacterCardStyle', () => {
    const mockCharacter = {
      name: 'Tyler',
      isPurchased: false,
      price: 1000,
      canAfford: true,
      isLocked: false
    }

    it('should return base character card style', () => {
      const style = getCharacterCardStyle(mockCharacter)
      
      expect(style).toMatchObject({
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '3px solid #fc3f31',
        borderRadius: '15px',
        height: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      })
    })

    it('should return mobile styles when isMobile is true', () => {
      const style = getCharacterCardStyle(mockCharacter, { isMobile: true })
      
      expect(style.height).toBe('200px')
      expect(style.padding).toBe('15px')
    })

    it('should handle purchased character card', () => {
      const purchasedCharacter = { ...mockCharacter, isPurchased: true }
      const style = getCharacterCardStyle(purchasedCharacter)
      
      expect(style.cursor).toBe('default')
      expect(style.opacity).toBe(1)
      expect(style.border).toBe('3px solid #FFD700')
    })

    it('should handle locked character card', () => {
      const lockedCharacter = { 
        ...mockCharacter, 
        price: 1000,
        canAfford: false,
        isPurchased: false 
      }
      const style = getCharacterCardStyle(lockedCharacter)
      
      expect(style.cursor).toBe('not-allowed')
      expect(style.opacity).toBe(0.6)
      expect(style.border).toBe('3px solid #666')
    })

    it('should handle opponent card styling', () => {
      const style = getCharacterCardStyle(mockCharacter, { isOpponent: true })
      
      expect(style.cursor).toBe('pointer')
      expect(style.opacity).toBe(1)
      expect(style.border).toBe('3px solid #fc3f31')
    })

    it('should handle locked opponent card', () => {
      const lockedOpponent = { ...mockCharacter, isLocked: true }
      const style = getCharacterCardStyle(lockedOpponent, { isOpponent: true })
      
      expect(style.cursor).toBe('not-allowed')
      expect(style.opacity).toBe(0.6)
      expect(style.border).toBe('3px solid #666')
    })

    it('should handle mobile opponent card', () => {
      const style = getCharacterCardStyle(mockCharacter, { 
        isMobile: true, 
        isOpponent: true 
      })
      
      expect(style.height).toBe('200px')
      expect(style.padding).toBe('10px')
    })
  })
}) 