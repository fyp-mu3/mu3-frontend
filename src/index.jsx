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

const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware(browserHistory), thunk),
  autoRehydrate()
)

const store = createStore(
  reducer,
  /* preloadStates, */
  enhancer
)

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
