// @flow

import type { Job, Action } from '../models/Types'

type State = {
  items: [Job],
  fetching: boolean,
  viewJobId: string,
  adminViewJobId: string,
}

const initialState: State = {
  items: [],
  fetching: false,
  viewJobId: null,
  adminViewJobId: null
}

/** Actions */
export const JobsActions = {
  fetch: (payload) => {
    return {
      type: 'JOBS_FETCH',
      payload: payload
    }
  },
  success: (data) => {
    return {
      type: 'JOBS_SUCCESS',
      payload: data
    }
  },
  view: (id) => {
    return {
      type: 'JOBS_VIEW',
      payload: id
    }
  },
  adminViewJob: (id) => {
    return {
      type: 'JOBS_ADMIN_VIEW_REQUEST',
      payload: id
    }
  }
}

/** thunk */
export const Thunk = {
  fetch: (offset, emailAddress) => (dispatch) => {
    dispatch(JobsActions.fetch(emailAddress))

    _fetchJobs(0, emailAddress)
    .then(data => {
      dispatch(JobsActions.success(data))
    })
  }
}

/** Reducer */
const jobsReducer = (state: State = initialState, action: Action): State => {
  if (action.type === 'JOBS_FETCH') {
    return {...state, fetching: true}
  }

  if (action.type === 'JOBS_SUCCESS') {
    return {...state, fetching: false, items: action.payload}
  }

  if (action.type === 'JOBS_VIEW') {
    return {...state, viewJobId: action.payload}
  }

  if (action.type === 'JOBS_ADMIN_VIEW_REQUEST') {
    return {...state, adminViewJobId: action.payload}
  }

  return state
}

export default jobsReducer

/** side effects */
const _fetchJobs = (offset: number, emailAddress: string): Promise<[Job]> => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/jobs?emailAddress=' + encodeURIComponent(emailAddress)).then(response => {
      response.json().then(json => {
        if (json.status === -1) {
          // reject(json)
        } else {
          resolve(json)
        }
      })
    })
  })
}