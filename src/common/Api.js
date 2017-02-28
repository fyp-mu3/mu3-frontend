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
}

export default Api
