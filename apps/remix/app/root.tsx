import { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { TamaguiProvider } from "@tamagui/core";
import tamaguiResetStyles from "@tamagui/core/reset.css?url";

import tamaguiConfig from "../tamagui.config";

export function Layout({ children }: { children: React.ReactNode }) {
  let tamaguiStyles = tamaguiConfig.getCSS();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{tamaguiStyles}</style>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              process.env.TAMAGUI_TARGET = \"web\";
              `,
          }}
        />
      </body>
    </html>
  );
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tamaguiResetStyles },
];

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} disableRootThemeClass={true}>
      <Outlet />
    </TamaguiProvider>
  );
}
