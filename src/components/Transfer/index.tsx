import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Button, Box, TextField, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider, TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'

import { getErrorMessage } from '../../connectors'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { getAddressOfFool, getAmountOfFool, getBalance, updateAddressOfFool, updateAmountOfFool, updateBalance } from '../../redux/slices/appSlice'
import useKingOfFool from '../../hooks/useKingOfFool'
import { KING_OF_FOOL_ADDRESS } from '../../config/kingOfFool'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      minWidth: '25rem',
      maxWidth: '25rem',
      textAlign: 'center',
      margin: 'auto',
      marginTop: '10rem'
    },
    button: {
      minWidth: '15rem',
      marginBottom: '1rem',
    },
    link: {
      textDecoration: 'none'
    }
  })
)

const Transfer = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [transaction, setTransaction] = useState('')
  const [transactionError, setTransactionError] = useState('')
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const { account, library, chainId, deactivate, active, error } = useWeb3React<Web3Provider>()
  const kingOfFoolContract = useKingOfFool(KING_OF_FOOL_ADDRESS);
  const balance = useAppSelector(getBalance)
  const amountOfFool = useAppSelector(getAmountOfFool);
  const addressOfFool = useAppSelector(getAddressOfFool);

  console.log(amountOfFool)
  console.log(addressOfFool);

  useEffect(() => {
    if (!!account && !!library) {
      let stale = false

      library.getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            dispatch(updateBalance({eth: balance}))
          }
        })
        .catch(() => {
          if (!stale) {
            dispatch(updateBalance({eth: BigNumber.from(0), dai: BigNumber.from(0)}))
          }
        })

      return () => {
        stale = true
        dispatch(updateBalance({eth: BigNumber.from(0), dai: BigNumber.from(0)}))
      }
    }
  }, [account, library, chainId, receipt])

  useEffect(() => {
    if (kingOfFoolContract) {
      kingOfFoolContract.amountOfFool().then((res: BigNumber) => (
        dispatch(updateAmountOfFool(res))
      ))

      kingOfFoolContract.addrOfFool().then((res: String) => (
        dispatch(updateAddressOfFool(res))
      ))
    }
  }, [account, library, receipt])

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (kingOfFoolContract) {
      setTransactionError('')
      kingOfFoolContract.depositETH({value: parseUnits(amount, 18)})
        .then((res: TransactionResponse) => {
          setTransaction(res.hash)
          return res.wait()
        })
        .then((res: TransactionReceipt) => {
          setTransaction('')
          setAmount('')
          setAddress('')
          setReceipt(res)
        })
        .catch((e: Error) => {
          setTransaction('')
          console.log(e.message);
          if ( e.message.search("INSUFFICIENT AMOUNT")) {
            alert("INSUFFICIENT AMOUNT");
          } else {
            setTransactionError(`Message: ${e.message}`)
          }
        })
    }
  }

  const handleHideSnackbar = () => {
    setReceipt(undefined)
  }

  const getReceiptDetail = () => {
    if (!!receipt) {
      return `Transaction ${receipt.transactionHash} to ${receipt.to} is complete`
    }

    return null
  }

  const daiBalance = balance.dai ? parseFloat(formatUnits(balance.dai)) : 0

  return (
    <Container>
      <div className={classes.form}>
        { error && (
          <Box textAlign="center">
            <Typography align="center">{getErrorMessage(error)}</Typography>

          </Box>
        )}


        {active && kingOfFoolContract && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              helperText={`Fool: ${addressOfFool} Amount: ${parseFloat(formatUnits(amountOfFool))}ETH`}
              label="Enter ETH Amount"
              name="amount"
              onChange={handleAmount}
              disabled={!!transaction}
              value={amount}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!!transaction}
              className={classes.button}
            >
              { !!transaction ? 'WAITING...' : 'DEPOSIT' }
            </Button>

            { transaction && (
              <a href={`https://ropsten.etherscan.io/tx/${transaction}`} target="_blank" className={classes.link}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  VIEW ON EHTERSCAN
                </Button>
              </a>
            )}

            { transactionError && (
              <Typography color="secondary">{transactionError}</Typography>
            )}
          </form>
        )}

        { (error || active) && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => deactivate()}
          >
            DISCONNECT
          </Button>
        )}
      </div>

      { receipt && (
        <Snackbar open={!!receipt} autoHideDuration={6000} onClose={handleHideSnackbar}>
          <Alert onClose={handleHideSnackbar} severity="success">
            {getReceiptDetail()}
          </Alert>
        </Snackbar>
      )}

    </Container>
  )
}

export default Transfer
