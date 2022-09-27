import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core'
import { Brightness4, Brightness7 } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectIsDark, toggleTheme } from '../../redux/slices/themeSlice'
import { getConnecting, getBalance, BalanceType } from '../../redux/slices/appSlice'
import { toggleConnectorModal } from '../../redux/slices/appSlice'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1
    },
    connect: {
      color: theme.palette.primary.main
    }
  })
)

const getAccountName = (account: string): string => {
  return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
}

const Header = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector(selectIsDark)
  const isConnecting = useAppSelector(getConnecting)
  const balance: BalanceType = useAppSelector(getBalance)
  const { account, error } = useWeb3React<Web3Provider>()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          DeFi App
        </Typography>

        <IconButton
          aria-label="Toggle light/dark mode"
          onClick={() => dispatch(toggleTheme())}
        >
          { isDarkMode ? <Brightness7 /> : <Brightness4 /> }
        </IconButton>

        { (account && !error) && (
          <div>
            <Typography>{getAccountName(account)}</Typography>
            <Typography>{formatEther(balance.eth)} ETH</Typography>
          </div>
        )}
        { (!account && !error) && (
          <Button
            variant="contained"
            className={classes.connect}
            onClick={() => dispatch(toggleConnectorModal(true))}
            disabled={isConnecting}
          >
            { isConnecting ? 'CONNECTING' : 'CONNECT WALLET' }
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
