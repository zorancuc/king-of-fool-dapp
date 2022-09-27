import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'

import { RootState } from '../store'
import { ConnectorNames } from '../../connectors'

export type ConnectorType = ConnectorNames | null

interface AppState {
  connectModalOpen: boolean,
  connector: ConnectorType,
  connecting: boolean,
  addressOfFool:String,
  amountOfFool: BigNumber,
  balance: BalanceType
}

export interface BalanceType {
  eth?: BigNumber,
  dai?: BigNumber
}

const initialState = {
  connectModalOpen: false,
  connector: null,
  connecting: false,
  addressOfFool: "",
  amountOfFool: BigNumber.from(0),
  balance: {
    eth: BigNumber.from(0),
    dai: BigNumber.from(0)
  } as BalanceType
} as AppState;

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleConnectorModal: (state, action: PayloadAction<boolean>) => {
      state.connectModalOpen = action.payload
    },
    connect: (state, action: PayloadAction<ConnectorType>) => {
      state.connector = action.payload
      state.connecting = true
    },
    connectComplete: (state) => {
      state.connecting = false
    },
    disconnect: (state) => {
      state.connector = null
      state.connecting = false
    },
    updateBalance: (state, action: PayloadAction<BalanceType>) => {
      state.balance = {...state.balance, ...action.payload}
    },
    updateAmountOfFool: (state, action: PayloadAction<BigNumber>) => {
      state.amountOfFool = {...state.amountOfFool, ...action.payload}
    },
    updateAddressOfFool: (state, action: PayloadAction<String>) => {
      state.addressOfFool = action.payload;
    },
  },
});

export const {
  toggleConnectorModal,
  connect,
  connectComplete,
  disconnect,
  updateBalance,
  updateAmountOfFool,
  updateAddressOfFool,
} = appSlice.actions

export const connectModalOpen = (state: RootState) => state.app.connectModalOpen
export const getConnector = (state: RootState) => state.app.connector
export const getConnecting = (state: RootState) => state.app.connecting
export const getBalance = (state: RootState): BalanceType => state.app.balance
export const getAmountOfFool = (state: RootState): BigNumber => state.app.amountOfFool
export const getAddressOfFool = (state: RootState): String => state.app.addressOfFool

export default appSlice.reducer;
