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
