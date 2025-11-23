import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    fonts: {
      body: string
      heading: string
    }
    colors: {
      bg: string
      card: string
      accent: string
      accentHover: string
      text: string
      subtle: string
      border: string
    }
    radii: {
      sm: string
      md: string
    }
    shadows: {
      card: string
      hover: string
    }
  }
}

export const theme = {
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter Tight', sans-serif",
  },
  colors: {
    bg: "#F7F7F8",
    card: "#FFFFFF",
    accent: "#7F5AF0",
    accentHover: "#6243d6",
    text: "#111111",
    subtle: "#666666",
    border: "#E5E7EB",
  },
  radii: {
    sm: "6px",
    md: "10px",
  },
  shadows: {
    card: "0 2px 6px rgba(0,0,0,0.08)",
    hover: "0 4px 12px rgba(0,0,0,0.12)",
  },
} as const satisfies Record<string, any>;