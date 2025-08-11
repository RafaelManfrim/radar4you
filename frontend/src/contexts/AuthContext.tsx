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
  firebase_uid: string | null
  email: string
  first_name: string
  login_provider: 'google' | 'facebook' | 'email'
  accepted_terms_at: number
  is_email_notifications_enabled: boolean
  profile_picture_url: string | null
  role: 'USER' | 'ADMIN'
  created_at: number
  updated_at: number
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
  signOut: () => Promise<void>
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

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isAuthenticated = authEnabled
    ? !!(authData && Object.keys(authData).length > 0)
    : true

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
      setAuthData((state) => ({
        tokens: state?.tokens ? state.tokens : getTokens(),
        user: userParam,
      }))
    }
  }

  async function processEffect(pathname: string) {
    if (!authEnabled) return

    try {
      const landingPagePath = '/site'
      const securePath = '/'
      const adminPath = '/admin'
      const otherPaths = ['/acesso-negado']

      const unauthenticatedPaths = [
        '/login',
        '/registro',
        '/esqueci-minha-senha',
        '/nova-senha',
      ]

      if (
        (pathname.includes(securePath) || pathname.includes(adminPath)) &&
        unauthenticatedPaths.every(
          (unauthenticatedPath) => !pathname.includes(unauthenticatedPath),
        )
      ) {
        const { access } = getTokens()

        if (access) {
          if (unauthenticatedPaths.some((path) => pathname.includes(path))) {
            return navigate('/calculadora')
          }

          try {
            const response = await api.get('/me')

            changeUser(response.data.user)
          } catch (error: unknown) {
            console.log(error)
            signOut()
          }
        } else {
          if (
            !unauthenticatedPaths.some((path) => pathname.includes(path)) &&
            pathname !== landingPagePath
          ) {
            signOut()
          }
        }
      } else if (
        !otherPaths.some((path) => pathname.includes(path)) &&
        pathname !== landingPagePath
      ) {
        const { refresh } = getTokens()

        if (refresh) {
          navigate('/calculadora')
        }
      }
    } catch (error: unknown) {
      console.log(error)
      signOut()
    }
  }

  useEffect(() => {
    processEffect(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  async function register(data: RegisterData) {
    try {
      await api.post('/register', data)

      if (data.login_provider === 'email') {
        await signIn({
          login_provider: data.login_provider,
          credentials: {
            email: data.email,
            password: data.password ?? '',
          },
        })
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function signIn(data: SignInData) {
    try {
      const authResponse = await api.post('/login', data)

      const { access, refresh, user } = authResponse.data

      Cookies.set('the-brocks.access', access, {
        expires: 1 / 24 / 2, // 30 minutes
        path: '/',
      })

      Cookies.set('the-brocks.refresh', refresh, {
        expires: 7, // 7 days
        path: '/',
      })

      api.defaults.headers.common.Authorization = `Bearer ${access}`

      setAuthData({
        tokens: {
          access,
          refresh,
        },
        user,
      })

      navigate('/calculadora')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function signInwithGoogle() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(async (result) => {
      if (result.user) {
        const { email, displayName, photoURL, uid } = result.user

        const accessToken = await result.user.getIdToken()

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

          const firstName = displayName?.split(' ')[0]

          await register({
            email,
            first_name: firstName ?? 'Usuário Google',
            login_provider: 'google',
            firebase_uid: uid,
            profile_picture_url: photoURL ?? undefined,
          })

          await signIn({
            login_provider: 'google',
            oauth_token: accessToken,
          })
        }
      }
    })
  }

  async function signOut() {
    try {
      const { access } = getTokens()

      Cookies.remove('the-brocks.access', { path: '/' })
      Cookies.remove('the-brocks.refresh', { path: '/' })

      if (access) {
        await api.post('/logout')
      }

      setAuthData(undefined)
      window.location.href = 'https://radar4you.com.br'
      // navigate('https://radar4you.com.br')
    } catch (err: unknown) {
      console.log(err)
      setAuthData(undefined)
      // navigate('https://radar4you.com.br')
      window.location.href = 'https://radar4you.com.br'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authData,
        isAuthenticated,
        getTokens,
        changeUser,
        signOut,
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
