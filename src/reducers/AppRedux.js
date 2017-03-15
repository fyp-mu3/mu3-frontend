// @flow

import Api from '../common/Api'

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
  updateUser: (email: string) => (dispatch) => {
    if (!email) { return }
    console.log(email)

    Api.usersGetByEmail(email)
    .then(userObj => {dispatch({
        type: 'APP_UPDATE_USER',
        payload: userObj
      }); console.log(userObj)}
    )
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
