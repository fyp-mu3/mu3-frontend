const initialState = {
  showRegisterScreen: false,
  user: null
}

export const AppActions = {
  displayRegisterScreen: (display: boolean) => {
    return {
      type: 'APP_SHOW_REGISTER',
      payload: display
    }
  }
}

/** Reducers */
const appReducer = (state = initialState, action) => {
  if (action.type === 'APP_SHOW_REGISTER') {
    return {...state, showRegisterScreen: action.payload}
  }

  return state
}

export default appReducer
