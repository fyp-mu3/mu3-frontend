// @flow
export type Action = {
  type: string,
  payload: any
}

export type CodeChallenge = {
  id: string,
  /**
   * Title display
   */
  title: string,

  /**
   * Rank A, B or C
   */
  rank: string,

  languages: [string],

  skills: number,

  content: string,

  output: string
}

export type User = {
  username: string,
  level: string,
  firstName: string,
  lastName: string,
  emailAddress: string
}

export type Company = {
  id: string,
  name: string,
  image: string,
  industry: [string],
  admin: [string]
}

export type Job = {
  id: string,
  title: string,
  company: Company,
  description: string,
  salary: string,
  rankRequired: string,
  applied: boolean
}