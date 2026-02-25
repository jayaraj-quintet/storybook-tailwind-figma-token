import type { Preview } from '@storybook/nextjs-vite'

// Import global styles with TailwindCSS and design tokens
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;