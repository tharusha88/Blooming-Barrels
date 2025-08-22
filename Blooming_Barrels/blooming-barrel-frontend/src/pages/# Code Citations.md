# Code Citations

## License: unknown
https://github.com/zfixler/full-stack-starter/tree/338ecefff046e758fc059bbe24f5be4c55e29631/apps/frontend/vite.config.js

```
} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
```

