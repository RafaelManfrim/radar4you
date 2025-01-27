import { api } from '@/lib/axios'
import { auth } from '@/services/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import _ from 'lodash'

export interface RegisterData {
  email: string
  first_name: string
  password?: string
  login_provider: 'google' | 'facebook' | 'email'
  firebase_uid?: string
  profile_picture_url?: string
}

export interface SignInData {
  login_provider: 'google' | 'facebook' | 'email'
  credentials?: {
    email: string
    password: string
  }
  oauth_token?: string
}

export interface User {
  id: string
}

type Tokens = {
  access: string | undefined
  refresh: string | undefined
}

export interface AuthData {
  user: User
  tokens: Tokens
}

type AuthContextData = {
  authData?: AuthData
  isAuthenticated: boolean
  register: (data: RegisterData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signInwithGoogle: () => Promise<void>
  // signOut: () => Promise<void>
  changeUser: (user: User) => void
  getTokens: () => Tokens
}

const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authData, setAuthData] = useState<AuthData>()

  const authEnabled = true

  // const navigate = useNavigate()
  // const { pathname } = useLocation()

  const isAuthenticated = !!(authEnabled
    ? authData && Object.keys(authData).length > 0
    : true)

  function getTokens() {
    const access = Cookies.get('the-brocks.access')
    const refresh = Cookies.get('the-brocks.refresh')

    if (access && refresh) {
      setAuthData(
        (state) =>
          state && {
            ...state,
            tokens: {
              access,
              refresh,
            },
          },
      )

      return { access, refresh }
    }

    return {
      access: undefined,
      refresh: undefined,
    }
  }

  function changeUser(userParam: User) {
    const userHasChanged = !_.isEqual(userParam, authData?.user)

    if (userHasChanged) {
      setAuthData(
        (state) =>
          state && {
            ...state,
            user: userParam,
          },
      )
    }
  }

  // async function processEffect(pathname: string) {
  //   if (!authEnabled) return

  //   try {
  //     const landingPagePath = '/'
  //     const securePath = '/calculadora'

  //     const unauthenticatedPaths = [
  //       '/login',
  //       '/registro',
  //       '/esqueci-minha-senha',
  //       '/nova-senha',
  //     ]

  //     if (pathname.includes(securePath)) {
  //       const { access } = getTokens()

  //       // const loginPath = '/participant/login'
  //       // const forgotMyPsswordPath = '/participant/forgot-my-password/'
  //       // const resetPasswordPath = '/participant/reset-password/'

  //       if (access) {
  //         if (unauthenticatedPaths.some((path) => pathname.includes(path))) {
  //           return navigate('/calculadora')
  //         }

  //         try {
  //           // TODO: Implementar rota de me
  //           // const url = `${import.meta.env.VITE_AUTH_ME as string}`
  //           // const response = await api.get(url, {
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //     Authorization: `Bearer ${access || getTokens()?.access}`,
  //           //   },
  //           // })
  //           // const json = response.data
  //           // changeUser(json.person)
  //         } catch (error: unknown) {
  //           console.log(error)
  //           signOut()
  //         }
  //       } else {
  //         if (
  //           !unauthenticatedPaths.some((path) => pathname.includes(path)) &&
  //           pathname !== landingPagePath
  //         ) {
  //           signOut()
  //         }
  //       }
  //     }
  //   } catch (error: unknown) {
  //     console.log(error)
  //     signOut()
  //   }
  // }

  // useEffect(() => {
  //   processEffect(pathname)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname])

  async function register(data: RegisterData) {
    try {
      await api.post('/register', data)
    } catch (error) {
      console.log(error)

      throw new Error('Erro ao registrar usuário')
    }
  }

  async function signIn(data: SignInData) {
    try {
      const authResponse = await api.post('/login', data)

      if (authResponse) {
        setAuthData(authResponse.data)
      }
    } catch (error) {
      console.log(error)

      throw new Error('Erro ao fazer login')
    }
  }

  async function signInwithGoogle() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result)

      if (result.user) {
        const { email, displayName, photoURL, uid } = result.user

        const accessToken = result.user.accessToken

        if (!email) {
          throw new Error('E-mail não encontrado')
        }

        try {
          await signIn({
            login_provider: 'google',
            oauth_token: accessToken,
          })
        } catch (error) {
          console.log(error)

          await register({
            email,
            first_name: displayName ?? 'Usuário Google',
            login_provider: 'google',
            firebase_uid: uid,
            profile_picture_url: photoURL ?? undefined,
          })
        }
      }
    })
  }

  // async function signOut() {
  //   try {
  //     const { access } = getTokens()

  //     Cookies.remove('the-brocks.access', { path: '/calculadora' })
  //     Cookies.remove('the-brocks.refresh', { path: '/calculadora' })

  //     if (access) {
  //       // TODO: Implementar rota de logout
  //       // const url = `${import.meta.env.VITE_AUTH_SIGNOUT as string}`
  //       // await api.post(url, {
  //       //   headers: {
  //       //     'Content-Type': 'application/json',
  //       //     Authorization: `Bearer ${access || getTokens()?.access}`,
  //       //   },
  //       // })
  //     }

  //     setAuthData(undefined)
  //     navigate('/login')
  //   } catch (err: unknown) {
  //     console.log(err)
  //     setAuthData(undefined)
  //     navigate('/login')
  //   }
  // }

  return (
    <AuthContext.Provider
      value={{
        authData,
        isAuthenticated,
        getTokens,
        changeUser,
        // signOut,
        signInwithGoogle,
        register,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
