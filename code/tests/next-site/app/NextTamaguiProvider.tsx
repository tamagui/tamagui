"use client";

import "@tamagui/core/reset.css";
import "@tamagui/font-inter/css/400.css";
import "@tamagui/font-inter/css/700.css";
import "@tamagui/polyfill-dev";

import { ReactNode } from "react";
// import { StyleSheet } from 'react-native'
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { TamaguiProvider } from "tamagui";
import appConfig from "../tamagui.config";

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    // @ts-ignore
    // const rnwStyle = StyleSheet.getSheet()
    return (
      <>
        <link rel="stylesheet" href="/tamagui.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: appConfig.getCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude:
                process.env.NODE_ENV === "production" ? "design-system" : null,
            }),
          }}
        />
        <style jsx global>{`
          html {
            font-family: "Inter";
          }
        `}</style>
      </>
    );
  });

  return (
    <NextThemeProvider
      skipNextHead
      // change default theme (system) here:
      defaultTheme="system"
      onChangeTheme={(next) => {
        setTheme(next as any);
      }}
    >
      <TamaguiProvider
        config={appConfig}
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
};
