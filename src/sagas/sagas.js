// @flow

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '../common/Api'

import { CompanyActions } from '../reducers/CompanyRedux'
import { JobActions } from '../reducers/JobsRedux'

import { routerActions } from 'react-router-redux'

function* userDidUpdate (action) {
  console.info('userDidUpdate', action)

  /** fetch companies */
  const companies = yield fetchCompanies()
  yield put(CompanyActions.fetchSuccess(companies))
}

function* fetchCompanies () {
  const jsonResponse = yield call(Api.companiesAdmin)
  return jsonResponse.data
}

function* adminViewCompany (action) {
  if (action.payload) {
    yield put(routerActions.push('/hr/view'))
  }
}

function* adminViewJob (action) {
  if (action.payload) {
    yield put(routerActions.push('/hr/job'))
  }
  return null
}

function* mySaga () {
  /** AppState */
  yield takeLatest('APP_UPDATE_USER', userDidUpdate)

  /** Jobs */
  yield takeLatest('COMPANY_ADMIN_VIEW_REQUEST', adminViewCompany)
  yield takeLatest('JOBS_ADMIN_VIEW_REQUEST', adminViewJob)
}

export default mySaga
