import { existsSync, lstatSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
function fullySpecifyCommonJS(api) {
  return api.assertVersion(7), {
    name: "babel-plugin-fully-specified-cjs",
    visitor: {
      CallExpression(path, state) {
        if (path.get("callee").isIdentifier({
          name: "require"
        }) && path.node.arguments.length === 1) {
          const arg = path.node.arguments[0];
          if (arg.type === "StringLiteral") {
            let moduleSpecifier = arg.value;
            if (moduleSpecifier.startsWith(".") || moduleSpecifier.startsWith("/")) {
              const filePath = state.file.opts.filename;
              if (!filePath) return;
              const fileDir = dirname(filePath),
                cjsExtension = ".cjs",
                jsExtension = ".js";
              if (!extname(moduleSpecifier)) {
                const resolvedPath = resolve(fileDir, moduleSpecifier);
                let newModuleSpecifier = moduleSpecifier;
                if (isLocalDirectory(resolvedPath)) {
                  const indexPath = resolve(resolvedPath, "index" + jsExtension);
                  if (existsSync(indexPath)) {
                    newModuleSpecifier.endsWith("/") || (newModuleSpecifier += "/"), newModuleSpecifier += "index" + cjsExtension, arg.value = newModuleSpecifier;
                    return;
                  }
                }
                const filePathWithJs = resolvedPath + jsExtension;
                if (existsSync(filePathWithJs)) {
                  newModuleSpecifier += cjsExtension, arg.value = newModuleSpecifier;
                  return;
                }
              }
            }
          }
        }
      }
    }
  };
}
function isLocalDirectory(absolutePath) {
  return existsSync(absolutePath) && lstatSync(absolutePath).isDirectory();
}
export { fullySpecifyCommonJS as default };
//# sourceMappingURL=commonjs.mjs.map
