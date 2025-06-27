import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5179,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  // 👇 This tells Vite to fallback to index.html for unknown routes
  
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
    
//   },
//   server: {
//     port:5179,
//     strictPort: true,
//     open: true, // 👈 This line auto-opens the browser
//   },
// });
  

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   css: {
//     postcss: './postcss.config.js',
//   },
//   server: {
//     port: 5173,
//     open: true,
//   },
// });



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// });