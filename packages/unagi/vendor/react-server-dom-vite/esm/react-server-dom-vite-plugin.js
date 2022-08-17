/**
* @license React
 * react-server-dom-vite-plugin.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';
import { normalizePath, transformWithEsbuild, createServer } from 'vite';
import { promises } from 'fs';
import path from 'path';

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var assign = Object.assign;

var rscViteFileRE = /\/react-server-dom-vite.js/;
var noProxyRE = /[&?]no-proxy($|&)/;

var isClientComponent = function (id) {
  return /\.client\.[jt]sx?($|\?)/.test(id);
};

function ReactFlightVitePlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      serverBuildEntries = _ref.serverBuildEntries,
      _ref$optimizeBoundari = _ref.optimizeBoundaries,
      optimizeBoundaries = _ref$optimizeBoundari === void 0 ? 'build' : _ref$optimizeBoundari,
      _ref$isServerComponen = _ref.isServerComponentImporterAllowed,
      isServerComponentImporterAllowed = _ref$isServerComponen === void 0 ? function (importer) {
    return false;
  } : _ref$isServerComponen;

  var config;
  var server;
  var resolveAlias;
  var globImporterPath;
  var allClientBoundaries = new Set();

  function invalidateGlobImporter() {
    if (globImporterPath && server) {
      server.watcher.emit('change', globImporterPath);
    }
  }

  return {
    name: 'vite-plugin-react-server-components',
    enforce: 'pre',
    buildStart: function () {
      // Let other plugins differentiate between pure SSR and RSC builds
      if (config?.build?.ssr) process.env.RSC_BUILD = 'true';
    },
    buildEnd: function () {
      if (config?.build?.ssr) delete process.env.RSC_BUILD;
    },
    configureServer: function (_server) {
      server = _server;
      var seenModules = {};
      server.ws.on('rsc:cc404', function (data) {
        if (!seenModules[data.id]) {
          seenModules[data.id] = true;
          invalidateGlobImporter();
        }
      });
    },
    configResolved: async function (_config) {
      await init;
      config = _config;
      var aliasPlugin = config.plugins.find(function (plugin) {
        return plugin.name === 'alias';
      });

      if (aliasPlugin) {
        resolveAlias = aliasPlugin.resolveId.bind({
          // Mock Rollup instance
          resolve: function (id) {
            return {
              then: function () {
                return id ? {
                  id: id
                } : null;
              }
            };
          }
        });
      } // By pushing this plugin at the end of the existing array,
      // we enforce running it *after* Vite resolves import.meta.glob.


      config.plugins.push(hashImportsPlugin);
    },
    resolveId: function (source, importer) {
      if (!importer) return null;

      if (noProxyRE.test(source)) {
        var _source$split = source.split('?'),
            id = _source$split[0],
            query = _source$split[1];

        return this.resolve(id, importer, {
          skipSelf: true
        }).then(function (result) {
          if (!result) return null;
          return assign({}, result, {
            id: result.id + (query ? "?" + query : ''),
            moduleSideEffects: false
          });
        });
      }
      /**
       * Throw errors when non-Server Components try to load Server Components.
       */


      if (/\.server(\.[jt]sx?)?$/.test(source) && !(/(\.server\.[jt]sx?|index\.html)$/.test(importer) || isServerComponentImporterAllowed(importer, source))) {
        throw new Error("Cannot import " + source + " from \"" + importer + "\". " + 'By react-server convention, .server.js files can only be imported from other .server.js files. ' + 'That way nobody accidentally sends these to the client by indirectly importing it.');
      }
    },
    load: function (id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!options.ssr || !isClientComponent(id) || noProxyRE.test(id)) return;      
      if (server) {
        var mod = server.moduleGraph.idToModuleMap.get(id.replace('/@fs', ''));

        if (mod && mod.importers) {
          if (Array.from(mod.importers).every(function (impMod) {
            return noProxyRE.test(impMod.id);
          })) {
            // This module is only imported from client components
            // so we don't need to create a module reference
            return;
          }
        } // Mark module as a client component.


        var moduleNode = server.moduleGraph.getModuleById(id);
        if (!moduleNode.meta) moduleNode.meta = {};

        if (!moduleNode.meta.isClientComponent) {
          moduleNode.meta.isClientComponent = true; // Invalidate glob importer file to account for the
          // newly discovered client component.

          invalidateGlobImporter();
        }
      }

      return proxyClientComponent(id.split('?')[0]);
    },
    transform: function (code, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // Add more information for this module in the graph.
      // It will be used later to discover client boundaries.
      if (server && options.ssr && /\.[jt]sx?($|\?)/.test(id)) {
        augmentModuleGraph(server.moduleGraph, id, code, config.root, resolveAlias);
      }
      /**
       * In order to allow dynamic component imports from RSC, we use Vite's import.meta.glob.
       * This hook replaces the glob placeholders with resolved paths to all client components.
       *
       * NOTE: Glob import paths MUST be relative to the importer file in
       * order to get the `?v=xxx` querystring from Vite added to the import URL.
       * If the paths are relative to the root instead, Vite won't add the querystring
       * and we will have duplicated files in the browser (with duplicated contexts, etc).
       */


      if (rscViteFileRE.test(id)) {
        var INJECTING_RE = /\{\s*__INJECTED_CLIENT_IMPORTERS__[:\s]*null[,\s]*\}\s*;/;
        var s = new MagicString(code);
        id = id.split('?')[0];

        if (options && options.ssr) {
          // In SSR, directly use components already discovered by RSC
          // instead of globs to avoid bundling unused components.
          s.replace(INJECTING_RE, 'globalThis.__COMPONENT_INDEX');
          return {
            code: s.toString(),
            map: s.generateMap({
              file: id,
              source: id
            })
          };
        }

        var injectGlobs = function (clientComponents) {
          var importerPath = path.dirname(id);
          var importers = clientComponents.map(function (absolutePath) {
            return normalizePath(path.relative(importerPath, absolutePath));
          });
          var injectedGlobs = "Object.assign(Object.create(null), " + importers.map(function (glob) {
            return (// Mark the globs to modify the result after Vite resolves them.
              "\n/* HASH_BEGIN */ " + ("import.meta.glob('" + normalizePath(glob) + "') /* HASH_END */")
            );
          }).join(', ') + ");";
          s.replace(INJECTING_RE, injectedGlobs);
          return {
            code: s.toString(),
            map: s.generateMap({
              file: id,
              source: id
            })
          };
        };

        if (config.command === 'serve') {
          globImporterPath = id; // When mixing client and server components from the same
          // facade file, the module graph can break and miss certain
          // import connections (bug in Vite?) due to HMR. Instead of
          // creating a new list of discovered components from scratch,
          // reuse the already discovered ones and simply add new ones
          // to the list without removing anything.

          findClientBoundaries(server.moduleGraph, optimizeBoundaries === true).forEach(function (boundary) {
            return allClientBoundaries.add(boundary);
          });
          return injectGlobs(Array.from(allClientBoundaries));
        }

        if (!serverBuildEntries) {
          throw new Error('[react-server-dom-vite] Parameter serverBuildEntries is required for client build');
        }

        return findClientBoundariesForClientBuild(serverBuildEntries, optimizeBoundaries !== false).then(injectGlobs);
      }
    },
    handleHotUpdate: function (_ref2) {
      var modules = _ref2.modules;

      if (modules.some(function (mod) {
        return mod.meta && mod.meta.isClientComponent;
      })) {
        return modules.filter(function (mod) {
          return !mod.meta || !mod.meta.ssr;
        });
      }

      return modules;
    }
  };
}

var btoa = function (hash) {
  return (// eslint-disable-next-line react-internal/safe-string-coercion
    Buffer.from(String(hash), 'binary').toString('base64')
  );
}; // Quick, lossy hash function: https://stackoverflow.com/a/8831937/4468962
// Prevents leaking path information in the browser, and minifies RSC responses.


function hashCode(value) {
  var hash = 0;

  for (var i = 0; i < value.length; i++) {
    var char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return btoa(hash).replace(/=+/, '');
}

var getComponentFilename = function (filepath) {
  return filepath.split('/').pop().split('.').shift();
};

var getComponentId = function (filepath) {
  return getComponentFilename(filepath) + "-" + hashCode(filepath);
};
async function proxyClientComponent(filepath, src) {
  var DEFAULT_EXPORT = 'default'; // Modify the import ID to avoid infinite wraps

  var importFrom = filepath + "?no-proxy";
  await init;

  if (!src) {
    src = await promises.readFile(filepath, 'utf-8');
  }

  var _await$transformWithE = await transformWithEsbuild(src, filepath),
      code = _await$transformWithE.code;

  var _parse = parse(code),
      exportStatements = _parse[1];

  var proxyCode = "import {wrapInClientProxy} from 'react-server-dom-vite/client-proxy';\n" + ("import * as allImports from '" + importFrom + "';\n\n"); // Wrap components in Client Proxy

  exportStatements.forEach(function (key) {
    var isDefault = key === DEFAULT_EXPORT;
    var componentName = isDefault ? getComponentFilename(filepath) : key;
    proxyCode += "export " + (isDefault ? DEFAULT_EXPORT : "const " + componentName + " =") + " /* @__PURE__ */wrapInClientProxy({ name: '" + componentName + "', id: '" + getComponentId(filepath) + "', value: allImports['" + key + "'], isDefault: " + // eslint-disable-next-line react-internal/safe-string-coercion
    String(isDefault) + " });\n";
  });
  return {
    code: proxyCode,
    moduleSideEffects: false
  };
}

function findClientBoundaries(moduleGraph) {
  var optimizeBoundaries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var clientBoundaries = []; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  var _iterator = _createForOfIteratorHelper(moduleGraph.fileToModulesMap.values()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var set = _step.value;
      var clientModule = Array.from(set).find(function (moduleNode) {
        return moduleNode.meta && moduleNode.meta.isClientComponent;
      });

      if (clientModule && (!optimizeBoundaries || isDirectImportInServer(clientModule))) {
        clientBoundaries.push(clientModule.file);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return clientBoundaries;
}

async function findClientBoundariesForClientBuild(serverEntries, optimizeBoundaries) {
  // Viteception
  var server = await createServer({
    clearScreen: false,
    server: {
      middlewareMode: 'ssr'
    }
  });

  try {
    // Load server entries to discover client components
    await Promise.all(serverEntries.map(server.ssrLoadModule));
  } catch (error) {
    error.message = 'Could not load server build entries: ' + error.message;
    throw error;
  }

  await server.close();
  return findClientBoundaries(server.moduleGraph, optimizeBoundaries);
}

var hashImportsPlugin = {
  name: 'vite-plugin-react-server-components-hash-imports',
  enforce: 'post',
  transform: function (code, id) {
    // Turn relative import paths to lossy hashes
    if (rscViteFileRE.test(id)) {
      var s = new MagicString(code);
      s.replace(/\/\*\s*HASH_BEGIN\s*\*\/\s*([^]+?)\/\*\s*HASH_END\s*\*\//gm, function (_, imports) {
        return imports.trim().replace(/"([^"]+?)":/gm, function (__, relativePath) {
          var absolutePath = path.resolve(path.dirname(id.split('?')[0]), relativePath);
          return "\"" + getComponentId(normalizePath(absolutePath)) + "\":";
        });
      });
      return {
        code: s.toString(),
        map: s.generateMap({
          file: id,
          source: id
        })
      };
    }
  }
};

/**
 * A client module should behave as a client boundary
 * if it is imported by the server before encountering
 * another boundary in the process.
 * This traverses the module graph upwards to find non client
 * components that import the `originalMod`.
 *
 * The `accModInfo` represents the exported members from the
 * `originalMod` but renamed accordingly to all the intermediate/facade
 * files in the import chain from the `originalMod` to every parent importer.
 */
function isDirectImportInServer(originalMod, currentMod, accModInfo) {
  // TODO: this should use recursion in any module that exports
  // the original one, not only in full facade files.
  if (!currentMod || (currentMod.meta || {}).isFacade) {
    if (!accModInfo && originalMod.meta && originalMod.meta.namedExports) {
      // First iteration in the recursion, initialize the
      // acumulator with data from the original module.
      accModInfo = {
        file: originalMod.file,
        exports: originalMod.meta.namedExports
      };
    }

    if (currentMod && accModInfo) {
      // Update accumulator in subsequent iterations with
      // whatever the current module is re-exporting.
      var lastModExports = accModInfo.exports;
      var lastModImports = currentMod.meta.imports.filter(function (importMeta) {
        return importMeta.action === 'export' && importMeta.from === accModInfo.file;
      });
      accModInfo = {
        file: currentMod.file,
        exports: []
      };
      lastModImports.forEach(function (mod) {
        mod.variables.forEach(function (_ref3) {
          var name = _ref3[0],
              alias = _ref3[1];

          if (name === '*' && !alias) {
            var _accModInfo$exports;

            (_accModInfo$exports = accModInfo.exports).push.apply(_accModInfo$exports, lastModExports);
          } else {
            accModInfo.exports.push(alias || name);
          }
        });
      });
    }

    return Array.from((currentMod || originalMod).importers || []).some(function (importer) {
      return (// eslint-disable-next-line no-unused-vars
        isDirectImportInServer(originalMod, importer, accModInfo)
      );
    });
  } // Not enough information: safer to assume it is
  // imported in server to create a new boundary.


  if (!currentMod.meta || !originalMod.meta) return true; // If current module is a client component, stop checking
  // parents since this can be the actual boundary.

  if (isClientComponent(currentMod.file)) return false; // If current module is not a client component, assume
  // it is a server component on a shared component
  // that will be imported in the server to be safe.
  // However, due to the lack of tree-shaking in the dev module graph,
  // we need to manually make sure this module is importing something from
  // the original module before marking it as client boundary.

  return currentMod.meta.imports.some(function (imp) {
    return imp.from === accModInfo.file && (imp.variables || []).some(function (_ref4) {
      var name = _ref4[0];
      return accModInfo.exports.includes(name);
    });
  });
}

function resolveModPath(modPath, dirname, retryExtension) {
  var absolutePath = '';

  try {
    absolutePath = modPath.startsWith('.') ? normalizePath(path.resolve(dirname, modPath)) : modPath;
    return normalizePath(require.resolve(absolutePath + (retryExtension || '')));
  } catch (error) {
    if (!/\.[jt]sx?$/.test(absolutePath) && retryExtension !== '.tsx') {
      // Node cannot infer .[jt]sx extensions.
      // Append them here and retry a couple of times.
      return resolveModPath(absolutePath, dirname, retryExtension ? '.tsx' : '.jsx');
    }
  }
}

function augmentModuleGraph(moduleGraph, id, code, root, resolveAlias) {
  var currentModule = moduleGraph.getModuleById(id);
  if (!currentModule) return;

  var _id$split = id.split('?'),
      source = _id$split[0];

  var dirname = normalizePath(path.dirname(source));

  var _parse2 = parse(code),
      rawImports = _parse2[0],
      namedExports = _parse2[1],
      isFacade = _parse2[2]; // This is currently not used but it should be considered
  // to improve the crawling in `isDirectImportInServer`.


  var imports = [];
  rawImports.forEach(function (_ref5) {
    var startMod = _ref5.s,
        endMod = _ref5.e,
        dynamicImportIndex = _ref5.d,
        startStatement = _ref5.ss,
        endStatement = _ref5.se;
    if (dynamicImportIndex !== -1) return; // Skip dynamic imports for now

    var rawModPath = code.slice(startMod, endMod);
    var modPath = rawModPath.split('?')[0];

    if (resolveAlias) {
      var resolvedAliasPath = resolveAlias(modPath, 'rsc_importer', {});

      if (resolvedAliasPath && resolvedAliasPath.id) {
        modPath = resolvedAliasPath.id;
      }
    }

    if (modPath && modPath.startsWith('/src/')) {
      // Vite default alias
      modPath = normalizePath(path.join(root, modPath));
    }

    var resolvedPath = resolveModPath(modPath, dirname);
    if (!resolvedPath) return; // Virtual modules or other exceptions

    var _code$slice$split$0$s = code.slice(startStatement, endStatement).split(/\s+(from\s+)?['"]/m)[0].split(/\s+(.+)/m),
        action = _code$slice$split$0$s[0],
        _code$slice$split$0$s2 = _code$slice$split$0$s[1],
        variables = _code$slice$split$0$s2 === void 0 ? '' : _code$slice$split$0$s2;

    imports.push({
      action: action,
      // 'import' or 'export'
      variables: variables // [['originalName', 'alias']]
      .trim().replace(/^[^{*]/, 'default as $&').replace(/[{}]/gm, '').trim().split(/\s*,\s*/m).filter(Boolean).map(function (s) {
        return s.split(/\s+as\s+/m);
      }),
      from: resolvedPath,
      // '/absolute/path'
      originalFrom: rawModPath // './path' or '3plib/subpath'

    });
  });

  if (!currentModule.meta) {
    currentModule.meta = {};
  }

  assign(currentModule.meta, {
    isFacade: isFacade,
    namedExports: namedExports,
    imports: imports,
    ssr: true
  });
}

export default ReactFlightVitePlugin;
