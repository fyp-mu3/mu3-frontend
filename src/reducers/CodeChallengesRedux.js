// @flow

import type { CodeChallenge } from '../models/Types'

type State = {
  items: [CodeChallenge],
  offset: number,
  fetching: boolean
}

const initialState: State = {
  items: [],
  offset: 0,
  fetching: false,
  currentChallengeId: null
}

/** Actions */
export const CodeChallengeActions = {
  fetch: () => {
    return {
      type: 'CODECHALLENGES_FETCH'
    }
  },
  success: (data) => {
    return {
      type: 'CODECHALLENGES_SUCCESS',
      payload: data
    }
  },
  loadChallenge: (id: string) => {
    return {
      type: 'CODECHALLENGES_LOAD',
      payload: id
    }
  }
}

/** thunk */
export const Thunk = {
  fetch: (offset: number) => (dispatch) => {
    dispatch(CodeChallengeActions.fetch())

    _fetchCodeChallenges(offset)
    .then((data) => {
      dispatch(CodeChallengeActions.success(data))
    })
  } 
}

/** Reducer */

const codeChallengeReducer = (state: State = initialState, action) => {
  if (action.type === 'CODECHALLENGES_FETCH') {
    return {...state, fetching: true}
  }

  if (action.type === 'CODECHALLENGES_SUCCESS') {
    let newItems = state.items.concat(action.payload)
    return {...state, fetching: false, items: newItems}
  }

  if (action.type === 'CODECHALLENGES_LOAD') {
    return {...state, currentChallengeId: action.payload}
  }

  return state
}

export default codeChallengeReducer

/** CodeChallenges side effects */
const _fetchCodeChallenges = (offset: number) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {resolve(dummyData)}, 1500)
  // })
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/challenges').then(response => {
      response.json().then(json => resolve(json))
    })
  })
}

const dummyData: [CodeChallenge] = [
  {id: '1', rank: 'S', title: 'fab num', skills: 5, languages: []},
  {id: '2', rank: 'A', title: 'Quick sort', skills: 4, languages: []},
  {id: '3', rank: 'D', title: 'Greedy algo', skills: 2, languages: []}
]
