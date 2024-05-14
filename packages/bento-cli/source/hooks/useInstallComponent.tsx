// @ts-nocheck
import { useContext, useEffect } from "react";
import { useGetComponent } from "./useGetComponent.js";
import { AppContext } from "../commands/index.js";
import { mkdirSync, existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { set } from "zod";

const hasAppDir = () => existsSync(path.join(process.cwd(), "app"));

const hasSrcDir = () => existsSync(path.join(process.cwd(), "src"));

const createUIDir = () =>
    mkdirSync(path.join(process.cwd(), "packages", "ui"), {
        recursive: true,
    });

const hasPackagesAndUIDir = () => {
    const packagesDir = path.join(process.cwd(), "packages");
    const uiDir = path.join(packagesDir, "ui");
    const srcDir = path.join(uiDir, "src");
    return existsSync(packagesDir) && existsSync(uiDir) && existsSync(srcDir);
};

const getComponentsFromTextFile = (components) => {
    const startOfTheFileRegex = /\/\*\* START of the file (.+\.tsx) \*\//;
    const lines = components.split("\n");
    let accContent = "";
    let componentName = "";
    const allComponents: { name: string; content: string }[] = [];
    lines.forEach((line, index) => {
        const matchedLine = line.match(startOfTheFileRegex);
        if (matchedLine) {
            const fileName = matchedLine[1];
            if (componentName) {
                allComponents.push({ name: componentName, content: accContent });
            }
            componentName = fileName;
            accContent = "";
        } else {
            accContent += `${line}\n`;
        }
    });
    if (componentName) {
        allComponents.push({ name: componentName, content: accContent });
    }
    return allComponents;
};

const installComponent = async ({component, setInstall}) => {
    const components = getComponentsFromTextFile();
    if (hasPackagesAndUIDir()) {
        // we need more checks but for now this is enough to test install of components.
        // check if the components/ui folder exists else create it
        // missing is to check if the component is present
        // think of adding later on the --overwrite flag in this piece of the process
        // install component here
        await Promise.all(components.map(component =>
            fs.writeFile(
                path.join(process.cwd(), "packages", "ui", "src", component.name),
                component.content
            )
        ));

        setInstall((prev) => ({
            installingComponent: null,
            installedComponents: [
                ...prev.installedComponents,
                install.installingComponent,
            ],
        }));
    } else {
        //TODO: add support for non monorepo projects
        console.log("no monorepo no install");

        setInstall((prev) => ({
            installingComponent: null,
            installedComponents: [
                ...prev.installedComponents,
                install.installingComponent,
            ],
        }));
    }
};

export const useInstallComponent = () => {
    const { install, setInstall } = useContext(AppContext);
	const {
		data: component,
		isLoading: isLoadingComponent,
		error: errorComponent,
	} = useGetComponent();

    useEffect(() => {

		// if (install.installingComponent && component) {
		if (component) {
			installComponent({component, setInstall});
		}
	}, [install?.installingComponent]);

}
