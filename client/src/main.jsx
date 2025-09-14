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
            gold: [
              '#FFF8E1',
              '#FFECB3',
              '#FFE082',
              '#FFD54F',
              '#FFCA28',
              '#FFC107',
              '#FFB300',
              '#FF8F00',
              '#FF6F00',
              '#bbb092',
            ],
            playerGold: [
              '#fff8e1',
              '#ffecb3',
              '#ffe082',
              '#ffd54f',
              '#ffca28',
              '#ffc107',
              '#ffb300',
              '#ff8f00',
              '#ff6f00',
              '#e65100'
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
          primaryColor: 'gold',
          primaryShade: 9,
          other: {
            primaryColor: '#bbb092',
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
