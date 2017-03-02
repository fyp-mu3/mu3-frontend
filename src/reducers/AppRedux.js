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
  },
  updateUser: (user: any) => {
    return {
      type: 'APP_UPDATE_USER',
      payload: user
    }
  }
}

/** Reducers */
const appReducer = (state = initialState, action) => {
  if (action.type === 'APP_SHOW_REGISTER') {
    return {...state, showRegisterScreen: action.payload}
  }

  if (action.type === 'APP_UPDATE_USER') {
    return {...state, user: action.payload}
  }

  return state
}

export default appReducer
