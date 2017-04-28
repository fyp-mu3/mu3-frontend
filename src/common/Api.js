const HOST_URL = 'http://localhost:3000/'

type Problem = {
  message: string
}

type Response = {
  statusCode: number,
  status: boolean,
  problem?: Problem,
  data: any
}

let _store = null

class Api {
  constructor () {

  }

  static subscribeStore(store) {
    _store = store
  }

  /** Auth */
  static authStatus (email: string): Promise<Response> {
    let encoded = encodeURIComponent(email)
    return new Promise((resolver, reject) => {
      fetch(HOST_URL + `auth/status?email=${encoded}`).then((response) => {
        response.json().then((json) => {
          if (json.status === 1) {
            resolver({...json, status: true})
          } else {
            reject({...json, status: false})
          }
        })
        .catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }

  /** User */
  static userUpdate (data = {
    username: null,
    firstName: null,
    lastName: null,
    emailAddress: null,
    profile: null
  }): Promise<Response> {
    console.info(data);
    return new Promise((resolve, reject) => {
      let option = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        }
      }

      fetch(HOST_URL + 'users/update', option).then((response) => {
        // resolve(json)
        response.json().then(json => resolve(json))
      })
      .catch(err => reject(err))
    })
  }

  static usersGetByEmail (emailAddress: string = ''): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(HOST_URL + `users/get?emailAddress=${emailAddress}`)
      .then((response) => {
        response.json().then(json => resolve(json) )
      })
      // .catch(err => reject(err))
    })
  }

  static userUpdateRanking (username: string = ''): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(HOST_URL + `users/updateRanking?emailAddress=${username}`).then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  /* Jobs */
  static companiesAdmin (): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'jobs/companies/me', null).then((response) => {
        response.json().then(json => resolve(json))
      })
      // .catch(err => reject(err))
    })
  }

  static fetchJob (): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'jobs/', null).then((response) => {
        response.json().then(json => resolve(json))
      })
    })
  }

  static jobCreate (job): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'jobs/create', {body: job}).then((response) => {
        response.json().then(json => resolve(json))
      })
    })
  }

  static jobApply (jobId): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'jobs/apply', null, `&job_id=${jobId}`).then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  static jobGetRanking (jobId, industry): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'jobs/computeRanking', null, `&job_id=${jobId}&industry=${industry}`).then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  /** Challenges */
  static fetchChallenges (): Promise<Response> {
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'challenges/').then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  static startChallegne (challenge_id: string, result: boolean): Promise<Response> {
    console.info(challenge_id, result);
    return new Promise((resolve, reject) => {
      Api.authFetch(HOST_URL + 'challenges/startChallenge', null, `&challenge_id=${challenge_id}&result=${result}`)
      .then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  /** Universities */

  static fetchUniversities (): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(HOST_URL + 'universities').then(response => {
        response.json().then(json => resolve(json))
      })
    })
  }

  /** Commons */
  static authFetch(url, options, extras) {
    let _user = _store.getState().app.user
    if (!_user) { 
      console.error('unauthed api fetch')
      return fetch()
    }
    let encodedEmail = encodeURIComponent(_user.emailAddress)
    let _extras = extras ? extras : ''

    if (options && options.body) {
      _extras += '&json=' + encodeURIComponent(JSON.stringify(options.body))
    }
    
    return fetch(url + `?emailAddress=${encodedEmail}` + _extras, options)
  }
}

export default Api
