import React from 'react'
import { render } from 'react-dom'

/** react-router-redux */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import createRouter from './router/router'

/** redux persist */
import { persistStore, autoRehydrate } from 'redux-persist'

/** redux-thunk */
import thunk from 'redux-thunk'

import { AppContainer } from 'react-hot-loader'

import reducers from './reducers'

import Api from './common/Api'

import mySaga from './sagas/sagas'
import createSagaMiddleware from 'redux-saga'

// import remotedev from 'remotedev-server'

// remotedev({
//   hostname: '127.0.0.1',
//   port: 1024
// })

/** sagas **/
const sagaMiddleware = createSagaMiddleware()

/** Reducers */
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

/** Middlewares */
/** https://github.com/zalmoxisus/redux-devtools-extension */
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?  
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose
// const composeEnhancers = composeWithDevTools({
//   realtime: true,
//   name: 'MU3',
//   host: '127.0.0.1',
//   port: 1024
// })

const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware(browserHistory), thunk, sagaMiddleware),
  autoRehydrate()
)

const store = createStore(
  reducer,
  /* preloadStates, */
  enhancer
)

Api.subscribeStore(store)

sagaMiddleware.run(mySaga)

const history = syncHistoryWithStore(browserHistory, store)

/** begin periodically persisting the store */
persistStore(store, {whitelist: ['session']}, () => {
  console.log('redux-persist rehydration complete')
})

render(
  <AppContainer>
    <Provider store={store}>
      {createRouter(history)}
    </Provider>
  </AppContainer>
  , document.querySelector('#app')
)

/*if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.querySelector('#app')
    )
  })
}*/
