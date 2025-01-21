import { auth } from '@/services/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { createContext, useContext } from 'react'

type AuthContextData = {
  signInwithGoogle: () => void
}

const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  function signInwithGoogle() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result)
    })
  }

  return (
    <AuthContext.Provider value={{ signInwithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
