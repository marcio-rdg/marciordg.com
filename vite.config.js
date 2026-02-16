import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';

const htmlSvgPlugin = () => {
  return {
    name: 'html-svg-plugin',
    transformIndexHtml(html) {
      return html.replace(
        /<svg-load name="([^"]+)" \/>/g,
        (match, fileName) => {
          try {
            const filePath = path.resolve(
              __dirname,
              'src/icons',
              `${fileName}.svg`
            );

            let svgContent = fs.readFileSync(filePath, 'utf-8');

            svgContent = svgContent.replace(/<\?xml.*?\?>/, '');

            return svgContent;
          } catch (error) {
            console.error(
              `Erro: Ícone "${fileName}" não encontrado em src/icons/`
            );
            return match;
          }
        }
      );
    },
  };
};

export default defineConfig({
  // Adicionamos uma verificação: o singlefile deve ser o último a rodar
  plugins: [htmlSvgPlugin(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true, // Isso ajuda o F12 a te mostrar onde está o erro
  },
  server: {
    // Garante que o servidor de dev tenha permissão para ler a raiz
    fs: {
      allow: ['..'],
    },
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    minify: 'terser',
  },
});
