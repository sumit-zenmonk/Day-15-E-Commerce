"use client"

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SnackbarProvider } from 'notistack';
import { StyledEngineProvider } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <SnackbarProvider maxSnack={8} autoHideDuration={3000}>
              {children}
            </SnackbarProvider>
          </Provider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
