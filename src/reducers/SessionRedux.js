import { REHYDRATE } from 'redux-persist/constants'

const initialState = {
  passport: null
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

  if (action.type === REHYDRATE) {
    return action.payload.session || {...state}
  }

  return {...state}
}

export default sessionReducer
