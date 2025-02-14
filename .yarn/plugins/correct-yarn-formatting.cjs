"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.factory = factory;
exports.name = "correct-yarn-formatting";
const configuration = {
    correctFormattingLogs: {
        description: "Can be used to set the verbosity of the plugin's logs.\n debug - shows everything \n notice - only shows a notice when the plugin stops a bad format and links to the feature request\n none - shows nothing",
        type: "STRING",
        default: "notice",
    },
};
class Logger {
    constructor(project) {
        this.logLevel =
            project.configuration.get("correctFormattingLogs") || "notice";
    }
    log(msg) {
        if (this.logLevel === "none")
            return;
        console.log(`[${exports.name}] ${msg}`);
    }
    debug(msg) {
        if (this.logLevel !== "debug")
            return;
        this.log(msg);
    }
    notice(msg) {
        if (this.logLevel === "notice" || this.logLevel === "debug") {
            this.log(msg);
        }
    }
}
function factory(_require) {
    const { readFileSync, writeFileSync } = _require("fs");
    const { join } = _require("path");
    const origPkgs = [];
    return {
        configuration,
        hooks: {
            validateProject(project) {
                const logger = new Logger(project);
                const topPkgJsonPath = join(project.cwd, "package.json");
                logger.debug(`Reading pre-formatted file: ${topPkgJsonPath}`);
                origPkgs.push([
                    topPkgJsonPath,
                    readFileSync(topPkgJsonPath).toString(),
                ]);
                project.workspaces.forEach((w) => {
                    const pkgJsonPath = join(w.cwd, "package.json");
                    logger.debug(`Reading pre-formatted file: ${pkgJsonPath}`);
                    origPkgs.push([pkgJsonPath, readFileSync(pkgJsonPath).toString()]);
                });
            },
            afterAllInstalled(project) {
                const logger = new Logger(project);
                let reset = false;
                origPkgs.forEach(([path, origPkgStr]) => {
                    const curPkgStr = readFileSync(path).toString();
                    if (origPkgStr &&
                        origPkgStr !== curPkgStr &&
                        // Simple equivalence by reserializing the exact same way
                        JSON.stringify(JSON.parse(curPkgStr)) ===
                            JSON.stringify(JSON.parse(origPkgStr))) {
                        writeFileSync(path, origPkgStr);
                        logger.debug(`Resetting unnecessary format for ${path}`);
                        reset = true;
                    }
                });
                if (reset) {
                    logger.notice("Resetting unnecessary formatting by yarn!\n\tIf you would like this to be a main feature please comment here: https://github.com/yarnpkg/berry/discussions/2636");
                }
            },
        },
    };
}
