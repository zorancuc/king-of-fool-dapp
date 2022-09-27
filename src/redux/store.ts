import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import appReducer from './slices/appSlice'
import themeReducer from './slices/themeSlice'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    app: appReducer,
    theme: themeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
