// @flow

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

  skills: number
}

export type User = {
  username: string,
  level: string,
  firstName: string,
  emailAddress: string
}