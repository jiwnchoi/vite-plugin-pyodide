/// <reference types="vite/client" />

import type { PyodideInterface } from "pyodide";
import type { Plugin } from "vite";

declare module "virtual:pyodide-files" {
	export function setupPyodideFiles(pyodide: PyodideInterface): Promise<void>;
	export function runEntryPoint(pyodide: PyodideInterface): any;
	export function runEntryPointAsync(pyodide: PyodideInterface): Promise<any>;
}

declare module "vite-plugin-pyodide" {
	export interface PyodidePluginOptions {
		base: string;
		entryPoint?: string;
	}

	export default function pyodidePlugin(options: PyodidePluginOptions): Plugin;
}
