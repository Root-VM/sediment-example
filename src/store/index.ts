import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import createPersistPlugin, { getPersistor } from '@rematch/persist'
import storage from "redux-persist/lib/storage";

import profile from './profile';
import customers from './customers';
import common from './common';

const models = {
  profile,
  customers,
  common,
};

const persistPlugin = createPersistPlugin({
  key: 'root',
  storage,
  version: 2,
  whitelist: ['common', 'profile'],
})

const store = init<any>({
  models,
  plugins: [persistPlugin],
});

export default store;

export type RootState = RematchRootState<typeof models>;
export type RootDispatch = RematchDispatch<typeof models>;
