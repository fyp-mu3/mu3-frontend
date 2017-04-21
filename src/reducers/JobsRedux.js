// @flow

import type { Job, Action } from '../models/Types'

import Fuse from 'fuse.js'
const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "title",
    "company.name"
  ]
}

type State = {
  items: [Job],
  fetching: boolean,
  viewJobId: string,
  adminViewJobId: string,
  search: string,
  filteredItems?: [Job]
}

const initialState: State = {
  items: [],
  fetching: false,
  viewJobId: null,
  adminViewJobId: null,
  search: null,
  filteredItems: null
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
  },
  adminCreateJob: (job) => {
    return {
      type: 'JOBS_ADMIN_CREATE_JOB',
      payload: job
    }
  },
  search: (query) => {
    return {
      type: 'JOBS_SEARCH',
      payload: query
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
    return {...state, fetching: false, items: action.payload, fuse: new Fuse(action.payload, fuseOptions)}
  }

  if (action.type === 'JOBS_VIEW') {
    return {...state, viewJobId: action.payload}
  }

  if (action.type === 'JOBS_ADMIN_VIEW_REQUEST') {
    return {...state, adminViewJobId: action.payload}
  }

  if (action.type === 'JOBS_SEARCH') {
    return {...state, search: action.payload, filteredItems: state.fuse.search(action.payload)}
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