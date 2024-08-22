/// <reference types="vite/client" />

import type { PyodideInterface } from "pyodide";
import type { Plugin } from "vite";

declare module "vite-plugin-pyodide/pyodide" {
	export function setupPyodideFiles(pyodide: PyodideInterface): Promise<void>;
}

declare module "vite-plugin-pyodide" {
	export interface PyodidePluginOptions {
		pythonFilesPath: string;
	}

	export default function pyodidePlugin(options?: PyodidePluginOptions): Plugin;
}
