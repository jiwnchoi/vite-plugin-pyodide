/// <reference types="vite/client" />
import type { PyodideInterface } from "pyodide";

declare module "virtual:pyodide-files" {
	export function setupPyodideFiles(pyodide: PyodideInterface): Promise<void>;
	export function runEntryPoint(pyodide: PyodideInterface): any;
	export function runEntryPointAsync(pyodide: PyodideInterface): Promise<any>;
}
