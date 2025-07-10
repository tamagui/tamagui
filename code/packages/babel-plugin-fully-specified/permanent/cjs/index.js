var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);
var index_exports = {};
__export(index_exports, {
  default: () => FullySpecified
});
module.exports = __toCommonJS(index_exports);
var import_node_fs = require("node:fs"), import_node_path = require("node:path");
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
  const fileExt = (0, import_node_path.extname)(filePath), fileDir = (0, import_node_path.dirname)(filePath), isDirectory = isLocalDirectory((0, import_node_path.resolve)(fileDir, originalModuleSpecifier)), currentModuleExtension = (0, import_node_path.extname)(originalModuleSpecifier), { tryExtensions, esExtensions, esExtensionDefault, ensureFileExists } = options, targetModule = evaluateTargetModule({
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
  return (0, import_node_fs.existsSync)(absoluteDirectory) && (0, import_node_fs.lstatSync)(absoluteDirectory).isDirectory();
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
  const targetFile = (0, import_node_path.resolve)(filenameDirectory, moduleSpecifier);
  if (ensureFileExists) {
    for (const extension of tryExtensions)
      if ((0, import_node_fs.existsSync)(targetFile + extension))
        return moduleSpecifier + esExtensionDefault;
    isDirectory && !(0, import_node_fs.existsSync)(
      (0, import_node_path.resolve)(
        filenameDirectory,
        currentModuleExtension ? moduleSpecifier : moduleSpecifier + esExtensionDefault
      )
    ) && (moduleSpecifier = `${moduleSpecifier}/index`);
  } else return esExtensions.includes(filenameExtension), moduleSpecifier + esExtensionDefault;
  return !1;
}
//# sourceMappingURL=index.js.map
