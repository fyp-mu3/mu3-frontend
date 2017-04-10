const host = 'http://localhost:3000/jobs/'
export default {
  applyWithId: (id, emailAddress) => {
    return new Promise((resolve, reject) => {
      global.fetch(host + `apply?job_id=${id}&emailAddress=${emailAddress}`).then((response) => {
        response.json().then(json => { console.info(json); resolve(json) })
      })
    })
  },

  findJobWithId: (id, jobState) => {
    if (jobState.items) {
      let result = jobState.items.filter((value) => {
        return value.id === id
      })
      if (result.length > 0) { return result[0] }
      else { return null }
    } else {
      return null
    }
  }
}
