// @flow

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Api from '../common/Api'

import { CompanyActions } from '../reducers/CompanyRedux'
import { JobsActions, Thunk as JobsThunk } from '../reducers/JobsRedux'
import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'
import { SessionActions } from '../reducers/SessionRedux'
import { AppActions } from '../reducers/AppRedux'

import { REHYDRATE } from 'redux-persist/constants'

import { routerActions } from 'react-router-redux'

function* appDidRehydrate (action) {
  if (action.payload.session) {
    yield put(SessionActions.updateSession(action.payload.session))
  }
}

function* sessionDidUpdate (action) {

  const { passport } = action.payload

  if (passport.user && passport.user.extractedUser && passport.user.extractedUser.emailAddress) {
    const userObj = yield call(Api.usersGetByEmail, passport.user.extractedUser.emailAddress)
    if (userObj) {
      yield put(AppActions.updateUser(userObj))
    }
  }
}

function* userDidUpdate (action) {
  console.info('userDidUpdate', action)

  /** fetch companies */
  const companies = yield fetchCompanies()
  yield put(CompanyActions.fetchSuccess(companies))
  yield put(JobsActions.fetch())
  yield put(CodeChallengeActions.fetch())
  yield updateRankingRequest({type: action.type, payload: action.payload.username})
}

function* updateRankingRequest (action) {
  console.info(action);
  try {
    const jsonResponse = yield call(Api.userUpdateRanking, action.payload)
    if (jsonResponse.status === 1 && jsonResponse.data && jsonResponse.data.username) {
      yield put(AppActions.updateRankingSuccess(jsonResponse.data))
    }
  } catch (e) {
    console.error(e)
  }
}

function* fetchCompanies () {
  try {
    const jsonResponse = yield call(Api.companiesAdmin)
    return jsonResponse.data
  } catch (e) {
    console.error(e)
    return []
  }
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
  return response
}

function* applyJob (action) {
  const response = yield call(Api.jobApply, action.payload)

  yield fetchJob()

  return response
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

function* computeRanking (action) {
  const result = yield call(Api.jobGetRanking, action.payload.jobId, action.payload.industry)
  yield put(JobsActions.fetch())

  yield delay(1500)

  yield put(JobsActions.computeRankingSuccess())
}

function* mySaga () {
  /** Session */
  yield takeLatest(REHYDRATE, appDidRehydrate)
  yield takeLatest('SESSION_UPDATE', sessionDidUpdate)

  /** AppState */
  yield takeLatest('APP_UPDATE_USER', userDidUpdate)
  yield takeEvery('APP_UPDATE_RANKING_REQUEST', updateRankingRequest)

  /** Jobs */
  yield takeLatest('COMPANY_ADMIN_VIEW_REQUEST', adminViewCompany)
  yield takeLatest('COMPANY_FETCH_REQUEST', fetchCompanies)

  yield takeEvery('JOBS_COMPUTE_RANKING', computeRanking)
  yield takeLatest('JOBS_ADMIN_VIEW_REQUEST', adminViewJob)
  yield takeLatest('JOBS_ADMIN_CREATE_JOB', adminCreateJob)
  yield takeLatest('JOBS_FETCH', fetchJob)
  yield takeLatest('JOBS_APPLY', applyJob)

  yield takeLatest('CODECHALLENGES_FETCH', fetchChallenges)
  yield takeLatest('CODECHALLENGES_START', startChallenge)

  yield takeLatest('SESSION_DESTROY', sessionDestroy)
}

export default mySaga
