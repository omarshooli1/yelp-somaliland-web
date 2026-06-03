import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C41200',
          green: '#12864A',
          gold: '#F4B942',
          ink: '#1D2428'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(29, 36, 40, 0.10)'
      }
    }
  },
  plugins: []
};

export default config;
