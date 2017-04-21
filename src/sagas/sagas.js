// @flow

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '../common/Api'

import { CompanyActions } from '../reducers/CompanyRedux'
import { JobsActions, Thunk as JobsThunk } from '../reducers/JobsRedux'
import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'
import { SessionActions } from '../reducers/SessionRedux'

import { routerActions } from 'react-router-redux'

function* userDidUpdate (action) {
  console.info('userDidUpdate', action)

  /** fetch companies */
  const companies = yield fetchCompanies()
  yield put(CompanyActions.fetchSuccess(companies))
  yield put(JobsActions.fetch())
  yield put(CodeChallengeActions.fetch())
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

function* adminCreateJob (action) {
  if (action.payload) {
    yield call(Api.jobCreate, action.payload)
  }

  yield put(JobsActions.fetch())
}

function* fetchJob (action) {
  const response = yield call(Api.fetchJob)
  yield put(JobsActions.success(response))
}

function* fetchChallenges (action) {
  const response = yield call(Api.fetchChallenges)

  yield put(CodeChallengeActions.success(response))
}

function* startChallenge (action) {
  let { challenge_Id, result } = action.payload

  // check if challeng is taken before
  yield call(Api.startChallegne, challenge_Id, result)

  yield call(Api.fetchChallenges)

  if (result) {
    // update candidate rank
  }
}

function* sessionDestroy (action) {
  yield put(routerActions.replace('/login'))
}

function* mySaga () {
  /** AppState */
  yield takeLatest('APP_UPDATE_USER', userDidUpdate)

  /** Jobs */
  yield takeLatest('COMPANY_ADMIN_VIEW_REQUEST', adminViewCompany)
  yield takeLatest('COMPANY_FETCH_REQUEST', fetchCompanies)

  yield takeLatest('JOBS_ADMIN_VIEW_REQUEST', adminViewJob)
  yield takeLatest('JOBS_ADMIN_CREATE_JOB', adminCreateJob)
  yield takeLatest('JOBS_FETCH', fetchJob)

  yield takeLatest('CODECHALLENGES_FETCH', fetchChallenges)
  yield takeLatest('CODECHALLENGES_START', startChallenge)

  yield takeLatest('SESSION_DESTROY', sessionDestroy)
}

export default mySaga
