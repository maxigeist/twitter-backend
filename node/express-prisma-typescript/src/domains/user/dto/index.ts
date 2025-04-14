export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
  }

  id: string
  name: string | null
  createdAt: Date
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.username = user.username
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
}

export class UserWithAccountTypeDTO {
  constructor (user: UserWithAccountTypeDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.private = user.private
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  private: boolean
}

export class UserProfileDTO {
  constructor (user: UserProfileDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.private = user.private
    this.followers = user.followers
    this.following = user.following
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  private: boolean
  followers: UserWithAccountTypeDTO[]
  following: UserWithAccountTypeDTO[]
}
