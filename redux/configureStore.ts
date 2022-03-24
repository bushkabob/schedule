import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { rootReducer } from './index'

import ExpoFileSystemStorage from 'redux-persist-expo-filesystem'

const configureStore = () => {
  const persistConfig = {
    key: 'root',
    storage: ExpoFileSystemStorage
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const store = createStore(persistedReducer)
  const persistor = persistStore(store)
  return { store, persistor }
}

export default configureStore;