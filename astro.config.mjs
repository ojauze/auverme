import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
  site: 'https://auverme-orthopedagogie.fr',
  output: 'static',
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
        autoInstall: true,
        customCollections: {
          local: FileSystemIconLoader('./src/assets/icons', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
        },
      }),
    ],
  },
});
