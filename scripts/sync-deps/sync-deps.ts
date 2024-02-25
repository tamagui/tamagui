#!/usr/bin/env bun-safe
import * as url from "url";
import nodePath from "path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const CWD = nodePath.resolve(__dirname, "../../");

process.env.CWD = CWD;

import depcheck from "depcheck";
import { packageRunner } from "runmate";
import * as fs from "fs";

const runner = await packageRunner({ cwd: CWD });

const added: Record<string, string> = {};

await Promise.all(
  runner.utils.flatMap(async ({ name, cwd, saveJSON, json }) => {
    if (!cwd.match("/packages/")) return;
    try {
      const {
        dependencies = {},
        devDependencies = {},
        peerDependencies = {},
      } = json;
      json.dependencies = dependencies;
      json.devDependencies = devDependencies;
      json.peerDependencies = peerDependencies;

      function alignPack(pack: string) {
        const path = nodePath.resolve(
          CWD,
          `./node_modules/${pack}/package.json`,
        );

        if (pack === "react" || pack === "react-dom") {
          devDependencies["react"] = "^18.2.0";
          devDependencies["react-dom"] = "^18.2.0";
          devDependencies["@types/react"] = "~18.2.14";
          devDependencies["@types/react-dom"] = "^18.2.19";

          // peers
          peerDependencies["react"] = "*";
          peerDependencies["react-dom"] = "*";
        } else if (pack === "react-native") {
          devDependencies["react"] = "^18.2.0";
          devDependencies["react-native"] = "^0.73.4";
          devDependencies["@types/react"] = "~18.2.14";

          peerDependencies["react"] = "*";
          peerDependencies["react-native"] = "*";
        } else {
          if (
            devDependencies[pack] ||
            dependencies[pack] ||
            peerDependencies[pack]
          ) {
            return;
          }
          const { version } = JSON.parse(fs.readFileSync(path, "utf-8"));
          added[pack] = version;
          dependencies[pack] = version;
        }
      }

      const info = await depcheck(cwd, {});
      const missing = Object.keys(info.missing);

      missing.forEach((pack) => {
        if (pack === "page") return;
        if (pack === "pages") return;
        if (pack === name) return;

        const isLocalDep = runner.packages[pack];

        if (isLocalDep) {
          dependencies[pack] = "1.90.2";
        } else {
          alignPack(pack);
          console.log(`unknown dependency "${pack}" in ${name}`);
        }
      });

      Object.entries(json).forEach(([k, v]) => {
        if (typeof v === "object" && v && !Object.keys(v).length) {
          delete json[k];
        }
      });

      // //
      [dependencies, devDependencies, peerDependencies].forEach((item) => {
        Object.entries(item).forEach(([k]) => {
          alignPack(k);
        });
      });

      // Object.assign(json.dependencies, rootJSON.resolutions)
      saveJSON();
    } catch (e: any) {
      console.error(name, e.message);
    }
  }),
);

console.log(JSON.stringify(added, null, 2));
