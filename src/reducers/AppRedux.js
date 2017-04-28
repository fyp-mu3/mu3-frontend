// @flow

import Api from '../common/Api'

const initialState = {
  showRegisterScreen: false,
  user: null,
  ranking: {},
  universities: []
}

export const AppActions = {
  displayRegisterScreen: (display: boolean) => {
    return {
      type: 'APP_SHOW_REGISTER',
      payload: display
    }
  },
  // updateUser: (email: string) => (dispatch) => {
  //   if (!email) { return }
  //   console.log(email)

  //   Api.usersGetByEmail(email)
  //   .then(userObj => {dispatch({
  //       type: 'APP_UPDATE_USER',
  //       payload: userObj
  //     }); console.log(userObj)}
  //   )
  // }
  updateUser: (userObj) => {
    return {
      type: 'APP_UPDATE_USER',
      payload: userObj
    }
  },
  updateRankingRequest: (username) => {
    return {
      type: 'APP_UPDATE_RANKING_REQUEST',
      payload: username
    }
  },
  updateRankingSuccess: (ranking) => {
    return {
      type: 'APP_UPDATE_RANKING_SUCCESS',
      payload: ranking
    }
  },
  fetchUniversitiesRequest: () => {
    return {
      type: 'APP_FETCH_UNIVERSITIES_REQUEST',
      payload: null
    }
  },
  fetchUniversitiesSuccess: (items) => {
    return {
      type: 'APP_FETCH_UNIVERSITIES_SUCCESS',
      payload: items
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

  if (action.type === 'APP_UPDATE_RANKING_REQUEST') {
    return state
  }

  if (action.type === 'APP_UPDATE_RANKING_SUCCESS') {
    return {...state, ranking: {...state.ranking, [action.payload.username]: action.payload}}
  }

  if (action.type === 'APP_FETCH_UNIVERSITIES_SUCCESS') {
    return {...state, universities: action.payload}
  }

  return state
}

export default appReducer
