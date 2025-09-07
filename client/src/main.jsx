import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";
import { GameStateProvider } from "./contexts/GameState";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameStateProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Anton, Impact, sans-serif',
          headings: { fontFamily: 'Anton, Impact, sans-serif' },
          colors: {
            blue: [
              '#E7F5FF',
              '#D0EBFF',
              '#A5D8FF',
              '#74C0FC',
              '#339AF0',
              '#228BE6',
              '#1C7ED6',
              '#1971C2',
              '#1864AB',
              '#F5F5DC',
            ],
            playerBlue: [
              '#e6f7ff',
              '#b3ebff',
              '#80dfff',
              '#4dd3ff',
              '#1ac7ff',
              '#04cbee',
              '#03a8c7',
              '#0285a0',
              '#016279',
              '#003f52'
            ],
            playerRed: [
              '#ffe6e6',
              '#ffb3b3',
              '#ff8080',
              '#ff4d4d',
              '#ff1a1a',
              '#A00000',
              '#d9362a',
              '#b62d23',
              '#93241c',
              '#701b15'
            ]
          },
          primaryColor: 'blue',
          primaryShade: 9,
          other: {
            primaryColor: '#F5F5DC',
          },
          globalStyles: (_theme) => ({
            html: {
              backgroundColor: '#000000 !important',
              background: '#000000 !important',
              margin: 0,
              padding: 0,
            },
            body: {
              width: "100vw",
              height: "100dvh",
              fontFamily: 'Anton, Impact, sans-serif',
              backgroundColor: '#000000 !important',
              background: '#000000 !important',
              margin: 0,
              padding: 0,
            },
            "#root": {
              width: "100%",
              height: "100%",
              backgroundColor: '#000000 !important',
              background: '#000000 !important',
              minHeight: '100dvh',
            },
            ".mantine-Button-root": {
              fontFamily: 'Anton, Impact, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            },
            "button": {
              fontFamily: 'Anton, Impact, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            },
            ".mantine-Text-root": {
              fontFamily: 'Anton, Impact, sans-serif',
            },
            ".mantine-Input-input": {
              fontFamily: 'Anton, Impact, sans-serif',
            },
            "*": {
              fontFamily: 'Anton, Impact, sans-serif !important',
            },
          }),
        }}
      >
        <CharacterAnimationsProvider>
          <App />
        </CharacterAnimationsProvider>
      </MantineProvider>
    </GameStateProvider>
  </React.StrictMode>
);
