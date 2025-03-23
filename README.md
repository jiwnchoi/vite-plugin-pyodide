# vite-plugin-pyodide

Copy your python .py files into pyodide.FS

## Usage
Install with npm install `vite-plugin-pyodide`

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import pyodidePlugin from "vite-plugin-pyodide";

export default defineConfig({
  plugins: [
    pyodidePlugin({ base: "./python" }),
    ...
```

```typescript
// vite-env.d.ts

/// <reference types="vite-plugin-pyodide" />
```

```typescript
import { setupPyodideFiles } from "virtual:pyodide-files";


pyodide = await loadPyodide();
await setupPyodideFiles(pyodide);
```