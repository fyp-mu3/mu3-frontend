// flow

export default class LinkedInProfile {
  accessToken: string;
  displayName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  profilePic: string;
  positions: [object];
  linkedInUrl: string;

  constructor (user) {
    this.accessToken = user.accessToken
    this.displayName = user.profile.displayName

    if (user.profile && user.profile._json) {
      const json = user.profile._json
      this.firstName = json.firstName
      this.lastName = json.lastName
      this.emailAddress = json.emailAddress
      this.profilePic = json.pictureUrl

      if (json.pictureUrls && json.pictureUrls.values && json.pictureUrls.values.length > 0) {
        this.profilePic = json.pictureUrls.values[0]
      }
      this.positions = json.positions
      this.linkedInUrl = json.publicProfileUrl
    }
  }
}