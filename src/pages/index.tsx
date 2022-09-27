import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from '../config/theme'
import { useAppSelector } from '../redux/hooks'
import { selectIsDark } from '../redux/slices/themeSlice'
import { Web3ReactProvider } from '@web3-react/core'

import Main from '../components/Main'
import { getLibrary } from '../connectors'

const Home = () => {
  const isDarkMode = useAppSelector(selectIsDark)
  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </Web3ReactProvider>
  )
}

export default Home
