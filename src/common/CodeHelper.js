// @flow
const API_KEY = 'hackerrank|841533-1248|0baedfe64a496a88a5f30a9bb9da66cf139e7097'
const API_ENDPOINT = 'http://api.hackerrank.com/checker/submission.json'
const API_METHOD = 'POST'

export const _langs = {'languages': {'names': {'c': 'C', 'cpp': 'C++', 'java': 'Java', 'csharp': 'C#', 'php': 'PHP', 'ruby': 'Ruby', 'python': 'Python 2', 'perl': 'Perl', 'haskell': 'Haskell', 'clojure': 'Clojure', 'scala': 'Scala', 'bash': 'Bash', 'lua': 'Lua', 'erlang': 'Erlang', 'javascript': 'Javascript', 'go': 'Go', 'd': 'D', 'ocaml': 'OCaml', 'pascal': 'Pascal', 'sbcl': 'Common Lisp (SBCL)', 'python3': 'Python 3', 'groovy': 'Groovy', 'objectivec': 'Objective-C', 'fsharp': 'F#', 'cobol': 'COBOL', 'visualbasic': 'VB.NET', 'lolcode': 'LOLCODE', 'smalltalk': 'Smalltalk', 'tcl': 'Tcl', 'whitespace': 'Whitespace', 'tsql': 'T-SQL', 'java8': 'Java 8', 'db2': 'DB2', 'octave': 'Octave', 'r': 'R', 'xquery': 'XQuery', 'racket': 'Racket', 'rust': 'Rust', 'fortran': 'Fortran', 'swift': 'Swift', 'oracle': 'Oracle', 'mysql': 'MySQL'}, 'codes': {'c': 1, 'cpp': 2, 'java': 3, 'python': 5, 'perl': 6, 'php': 7, 'ruby': 8, 'csharp': 9, 'mysql': 10, 'oracle': 11, 'haskell': 12, 'clojure': 13, 'bash': 14, 'scala': 15, 'erlang': 16, 'lua': 18, 'javascript': 20, 'go': 21, 'd': 22, 'ocaml': 23, 'r': 24, 'pascal': 25, 'sbcl': 26, 'python3': 30, 'groovy': 31, 'objectivec': 32, 'fsharp': 33, 'cobol': 36, 'visualbasic': 37, 'lolcode': 38, 'smalltalk': 39, 'tcl': 40, 'whitespace': 41, 'tsql': 42, 'java8': 43, 'db2': 44, 'octave': 46, 'xquery': 48, 'racket': 49, 'rust': 50, 'swift': 51, 'fortran': 54}}}

class CodeHelper {
  constructor () {

  }

  run (params) {
    const _headers = new Headers()
    _headers.append('Access-Control-Allow-Origin', '*')
    _headers.append('Access-Control-Allow-Methods', 'POST')
    _headers.append('Access-Control-Allow-Headers', 'Content-Type')
    return new Promise((resolve, reject) => {
      let option = {
        uri: API_ENDPOINT,
        method: API_METHOD,
        form: {
          api_key: API_KEY,
          lang: _langs.languages.codes[params.lang],
          wait: 'true',
          format: 'json',
          source: params.source,
          testcases: JSON.stringify(params.testcases)
        },
        mode: 'cors'
      }

      var _form = new FormData()

      Object.keys(option.form).forEach((key) => {
        _form.append(key, option.form[key])
      })
      option.body = _form

      console.info(option)
      global.fetch(option.uri, option)
      .then((response) => {
        console.info(response)
        response.json().then(val => {
          console.info(val)
          resolve(val)
        })
      })
      .catch(err => console.error(err))
    })
  }

  mapResult (codeResult) {
    if (!codeResult) { return null }
    let _content = codeResult.result

    let result = {
      stdout: _content.stdout || [],
      stderr: _content.stderr || [],
      message: _content.message,
      result: _content.result,
      time: _content.time,
      compileMessage: _content.compilemessage
    }
    
    return result
  }
}

const mInstance = new CodeHelper()
export default mInstance
