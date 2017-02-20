import React from 'react'
import { render } from 'react-dom'

/** react-router-redux */
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import { AppContainer } from 'react-hot-loader'
import App from './app.jsx'
import NotFound from './notfound'

const reducer = combineReducers({
  routing: routerReducer
})

const store = createStore(
  reducer,
  {}, // initialState
)

const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
      <Route path='/notfound' component={NotFound} />
    </Router>
  </Provider>
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
