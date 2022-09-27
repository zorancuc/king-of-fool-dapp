import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import Header from '../Header'
import ConnectModal from '../ConnectModal'
import Transfer from '../Transfer'
import { ConnectorType, connectorsByName } from '../../connectors'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import {
  connectModalOpen,
  toggleConnectorModal,
  connect,
  getConnecting,
  getConnector,
  connectComplete,
} from '../../redux/slices/appSlice'

const Main = () => {
  const { connector, activate } = useWeb3React<Web3Provider>()
  const dispatch = useAppDispatch()
  const modalOpen = useAppSelector(connectModalOpen)
  const connecting = useAppSelector(getConnecting)
  const currentConnector = useAppSelector(getConnector)

  useEffect(() => {
    if (currentConnector && connectorsByName[currentConnector] === connector) {
      dispatch(connectComplete())
    }
  }, [currentConnector, connector])

  const handleClose = (connectorName: ConnectorType) => {
    dispatch(toggleConnectorModal(false))
    if (connectorName && !connecting) {
      dispatch(connect(connectorName))
      activate(connectorsByName[connectorName])
    }
  }

  return (
    <>
      <Header />
      <ConnectModal open={modalOpen} onClose={handleClose} />
      <Transfer />
    </>
  )
}

export default Main
