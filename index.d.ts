/// <reference types="vite/client" />

import type { Plugin } from "vite";

declare module "vite-plugin-pyodide" {
	export interface PyodidePluginOptions {
		base: string;
		entryPoint?: string;
	}

	export default function pyodidePlugin(options: PyodidePluginOptions): Plugin;
}
