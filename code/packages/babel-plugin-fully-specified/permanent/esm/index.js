import { existsSync, lstatSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
const DEFAULT_OPTIONS = {
  ensureFileExists: !0,
  esExtensionDefault: ".mjs",
  tryExtensions: [".js"],
  esExtensions: [".mjs"]
};
function FullySpecified(api, rawOptions) {
  api.assertVersion(7);
  const options = { ...DEFAULT_OPTIONS, ...rawOptions }, importDeclarationVisitor = (path, state) => {
    const filePath = state.file.opts.filename;
    if (!filePath) return;
    const { node } = path;
    if (node.importKind === "type") return;
    const originalModuleSpecifier = node.source.value, fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
      originalModuleSpecifier,
      {
        filePath,
        options
      }
    );
    fullySpecifiedModuleSpecifier && (node.source.value = fullySpecifiedModuleSpecifier);
  }, exportDeclarationVisitor = (path, state) => {
    const filePath = state.file.opts.filename;
    if (!filePath) return;
    const { node } = path;
    if (node.exportKind === "type") return;
    const source = node.source;
    if (!source) return;
    const originalModuleSpecifier = source.value, fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
      originalModuleSpecifier,
      {
        filePath,
        options
      }
    );
    fullySpecifiedModuleSpecifier && (source.value = fullySpecifiedModuleSpecifier);
  };
  return {
    name: "babel-plugin-fully-specified",
    visitor: {
      ImportDeclaration: importDeclarationVisitor,
      ExportNamedDeclaration: exportDeclarationVisitor,
      ExportAllDeclaration: exportDeclarationVisitor,
      Import: (path, state) => {
        const filePath = state.file.opts.filename;
        if (!filePath) return;
        const parent = path.parent;
        if (parent.type !== "CallExpression")
          return;
        const firstArgOfImportCall = parent.arguments[0];
        if (firstArgOfImportCall.type !== "StringLiteral")
          return;
        const originalModuleSpecifier = firstArgOfImportCall.value, fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
          originalModuleSpecifier,
          {
            filePath,
            options
          }
        );
        fullySpecifiedModuleSpecifier && (firstArgOfImportCall.value = fullySpecifiedModuleSpecifier);
      }
    }
  };
}
function getFullySpecifiedModuleSpecifier(originalModuleSpecifier, {
  filePath,
  options
}) {
  const fileExt = extname(filePath), fileDir = dirname(filePath), isDirectory = isLocalDirectory(resolve(fileDir, originalModuleSpecifier)), currentModuleExtension = extname(originalModuleSpecifier), { tryExtensions, esExtensions, esExtensionDefault, ensureFileExists } = options, targetModule = evaluateTargetModule({
    moduleSpecifier: originalModuleSpecifier,
    filenameDirectory: fileDir,
    filenameExtension: fileExt,
    currentModuleExtension,
    isDirectory,
    tryExtensions,
    esExtensions,
    esExtensionDefault,
    ensureFileExists
  });
  return targetModule === !1 ? null : targetModule;
}
function isLocalDirectory(absoluteDirectory) {
  return existsSync(absoluteDirectory) && lstatSync(absoluteDirectory).isDirectory();
}
function evaluateTargetModule({
  moduleSpecifier,
  currentModuleExtension,
  isDirectory,
  filenameDirectory,
  filenameExtension,
  tryExtensions,
  esExtensions,
  esExtensionDefault,
  ensureFileExists
}) {
  if (currentModuleExtension && !esExtensions.includes(currentModuleExtension))
    return !1;
  const targetFile = resolve(filenameDirectory, moduleSpecifier);
  if (ensureFileExists) {
    for (const extension of tryExtensions)
      if (existsSync(targetFile + extension))
        return moduleSpecifier + esExtensionDefault;
    isDirectory && !existsSync(
      resolve(
        filenameDirectory,
        currentModuleExtension ? moduleSpecifier : moduleSpecifier + esExtensionDefault
      )
    ) && (moduleSpecifier = `${moduleSpecifier}/index`);
  } else return esExtensions.includes(filenameExtension), moduleSpecifier + esExtensionDefault;
  return !1;
}
export {
  FullySpecified as default
};
//# sourceMappingURL=index.js.map
