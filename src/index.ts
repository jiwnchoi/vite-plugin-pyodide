import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

interface PyodidePluginOptions {
	base: string;
	entryPoint?: string;
}

function pyodideFilesPlugin(options: PyodidePluginOptions): Plugin {
	const pythonFiles: Record<string, string> = {};
	const virtualModuleId = "virtual:pyodide-files";
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	return {
		name: "vite-plugin-pyodide-files",

		resolveId(id) {
			return id === virtualModuleId ? resolvedVirtualModuleId : null;
		},

		load(id) {
			return id === resolvedVirtualModuleId ? generateVirtualModule() : null;
		},

		handleHotUpdate({ file, server }) {
			if (file.endsWith(".py")) {
				updatePythonFile(file, options.base);
				server.ws.send({
					type: "full-reload",
					path: "*",
				});
			}
			return [];
		},
	};

	function updatePythonFile(filePath: string, basePath: string) {
		const relativePath = path.relative(basePath, filePath);
		const content = fs.readFileSync(filePath, "utf-8");
		pythonFiles[relativePath] = content;
	}

	function loadPythonFiles(dir: string, basePath: string) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				loadPythonFiles(fullPath, basePath);
			} else if (entry.isFile() && entry.name.endsWith(".py")) {
				updatePythonFile(fullPath, basePath);
			}
		}
	}

	function generateVirtualModule() {
		loadPythonFiles(options.base, options.base);
		const filesCode = Object.entries(pythonFiles)
			.map(([path, content]) => `  '${path}': ${JSON.stringify(content)}`)
			.join(",\n");

		return `
const pythonFiles = {
${filesCode}
};

const base = ${JSON.stringify(options.base)};
const entryPoint = ${JSON.stringify(options.entryPoint)};

export async function setupPyodideFiles(pyodide) {
  try {
    for (const [path, content] of Object.entries(pythonFiles)) {
      const fullPath = \`\${base}/\${path}\`;
      const parts = fullPath.split('/');
      let currentPath = '';
      for (const part of parts.slice(0, -1)) {
        currentPath += (currentPath ? '/' : '') + part;
        if (!pyodide.FS.analyzePath(currentPath).exists) {
          pyodide.FS.mkdir(currentPath);
        }
      }
      pyodide.FS.writeFile(fullPath, content);
    }
  } catch (error) {
    console.error('Failed to setup Pyodide files:', error);
    throw error;
  }
}

export function runEntryPoint(pyodide) {
  if (!entryPoint) {
    throw new Error('Entry point is not defined');
  }
  const entryPointPath = \`\${base}/\${entryPoint}\`;
  const code = pythonFiles[entryPoint];
  if (!code) {
    throw new Error(\`Entry point \${entryPointPath} not found\`);
  }
  return pyodide.runPython(code);
}

export async function runEntryPointAsync(pyodide) {
  if (!entryPoint) {
    throw new Error('Entry point is not defined');
  }
  const entryPointPath = \`\${base}/\${entryPoint}\`;
  const code = pythonFiles[entryPoint];
  if (!code) {
    throw new Error(\`Entry point \${entryPointPath} not found\`);
  }
  return await pyodide.runPythonAsync(code);
}
`;
	}
}

export default pyodideFilesPlugin;
