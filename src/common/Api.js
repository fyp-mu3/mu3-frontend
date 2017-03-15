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

class Api {
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
    emailAddress: null
  }): Promise<Response> {
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
      .catch(err => reject(err))
    })
  }
}

export default Api
