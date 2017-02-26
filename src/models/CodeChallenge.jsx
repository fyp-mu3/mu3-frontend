// @flow

export type CodeChallenge = {
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
