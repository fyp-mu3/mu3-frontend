// @flow

import type { Company, Job, Action } from '../models/Types'

type State = {
  items: [Company],
  fetching: boolean,
  adminViewCompanyId: string
}

const initState: State = {
  items: [],
  fetching: false,
  adminViewCompanyId: null
}

export const CompanyActions = {
  fetchRequest: () => {
    return {
      type: 'COMPANY_FETCH_REQUEST',
      payload: null
    }
  },

  fetchSuccess: (data) => {
    return {
      type: 'COMPANY_FETCH_SUCCESS',
      payload: data
    }
  },
  adminViewRequest: (id) => {
    return {
      type: 'COMPANY_ADMIN_VIEW_REQUEST',
      payload: id
    }
  }
}

const companyReducer = (state: State = initState, action: Action): State => {
  if (action.type === 'COMPANY_FETCH_REQUEST') {
    return {...state, fetching: true}
  }

  if (action.type === 'COMPANY_FETCH_SUCCESS') {
    return {...state, items: action.payload}
  }

  if (action.type === 'COMPANY_ADMIN_VIEW_REQUEST') {
    return {...state, adminViewCompanyId: action.payload}
  }
  
  return state
}

export default companyReducer
