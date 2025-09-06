export const BREAKPOINTS = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)'
};

export const CHARACTER_MODELS = {
  paths: {
    'PETE': './models/pete.glb',
    'TYLER': './models/Tyler.glb',
    'VINCE': './models/Vince.glb',
    'BOB': './models/Bob.glb',
    'CHUCK': './models/Chuck.glb',
    'EARL': './models/Earl.glb',
    'WAYNE': './models/Wayne.glb',
    'MARLA': './models/woman.gltf'
  },
  components: {
    'pete': 'Pete',
    'tyler': 'Tyler',
    'vince': 'Tyler',
    'bob': 'Pete'
  }
};

export const SHOP_MODELS = ['Vince', 'Bob'];

export const THEME = {
  colors: {
    primary: '#f32210',
    gold: '#4a6b8a',
    white: '#F5F5DC',
    black: '#000000',
    gray: '#666'
  },
  shadows: {
    neon: `
      0 0 10px #f32210,
      0 0 20px rgba(243, 34, 16, 0.2),
      inset 0 0 10px rgba(243, 34, 16, 0.05)
    `,
    button: '2px 2px 4px rgba(0, 0, 0, 0.8)'
  },
  fonts: {
    primary: 'Anton, Impact, sans-serif'
  }
}; 