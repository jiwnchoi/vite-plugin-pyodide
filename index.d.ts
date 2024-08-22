/// <reference types="vite/client" />

import type { PyodideInterface } from "pyodide";
import type { Plugin } from "vite";

declare module "virtual:pyodide-files" {
  export function setupPyodideFiles(pyodide: PyodideInterface): Promise<void>;
}

declare module "vite-plugin-pyodide" {
  export interface PyodidePluginOptions {
    // Add any plugin-specific options here
  }

  export default function pyodidePlugin(options?: PyodidePluginOptions): Plugin;
}
