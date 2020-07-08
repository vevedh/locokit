import lckClient from '@/services/lck-api'
import { BaseState } from './state'

class User {
  email = ''
  first_name = ''
  last_name = ''
  profile = ''
}

class Group {
  name = ''
  permissions: string[] = []
}

class AuthData {
  isAuthenticated = false
  user: User | null = null
  groups: Group[] = []
}

class AuthDTO {
  email = ''
  password = ''
}

// class UserDTO {
//   email = ''
//   first_name = ''
//   last_name = ''
//   password = ''
//   profile = ''
// }

class AuthState extends BaseState<AuthData> {}

export const authState: AuthState = {
  loading: false,
  error: null,
  data: {
    isAuthenticated: false,
    user: null,
    groups: []
  }
}

export async function reAuthenticate () {
  authState.loading = true
  try {
    const result = await lckClient.reAuthenticate()
    authState.data.isAuthenticated = true
    authState.data.user = result.user
  } catch (error) {
    authState.data.isAuthenticated = false
    authState.error = error
  }
  authState.loading = false
}

export async function authenticate (data: AuthDTO) {
  authState.loading = true
  try {
    const result = await lckClient.authenticate({
      strategy: 'local',
      email: data.email,
      password: data.password
    })
    authState.data.isAuthenticated = true
    authState.data.user = result.user
  } catch (error) {
    authState.data.isAuthenticated = false
    authState.error = error
  }
  authState.loading = false
}

export async function retrieveGroups () {
  if (!authState.data.isAuthenticated) return null
  authState.loading = true
  try {
    const result = await lckClient.service('group').find()
    console.log(result)
    authState.data.groups = result.data
  } catch (error) {
    authState.error = error
  }
  authState.loading = false
}
