import { REHYDRATE } from 'redux-persist/constants'

import Api from '../common/Api'

const initialState = {
  passport: null,
  /**
   * session has to be verified register status
   */
  needVerify: true
}

/** Actions */
export const SessionActions = {
  updateSession: (session) => {
    return {
      type: 'SESSION_UPDATE',
      payload: session
    }
  },
  destroySession: () => {
    return {
      type: 'SESSION_DESTROY'
    }
  },
  verifySession: (email: string) => (dispatch) => {
    Api.authStatus(email).then((response) => {
      let registered = response.data.registered
      let email = response.data.email

      console.log({
        email,
        registered
      });

      dispatch({
        type: 'SESSION_NEED_VERIFY',
        payload: false
      })

      if (!registered) {
        dispatch({
          type: 'APP_SHOW_REGISTER',
          payload: true
        })
      } else {
        dispatch({
          type: 'APP_SHOW_REGISTER',
          payload: false
        })
      }
    })
  }
}

/** Reducers */
const sessionReducer = (state = initialState, action) => {
  if (action.type === 'SESSION_UPDATE') {
    const { passport } = action.payload
    return {...state, passport: passport}
  }

  if (action.type === 'SESSION_DESTROY') {
    return {...state, passport: null}
  }

  if (action.type === 'SESSION_NEED_VERIFY') {
    return {...state, needVerify: action.payload}
  }

  if (action.type === REHYDRATE) {
    /** skip rehydrate if sesion doest not exists  */
    if (!action.payload.session) { return state }

    let restoredState = {
      passport: action.payload.session.passport, 
      needVerify: state.needVerify
    }
    return restoredState || {...state}
  }

  return state
}

export default sessionReducer
