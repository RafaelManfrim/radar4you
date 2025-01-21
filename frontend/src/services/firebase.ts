import * as firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { env } from '@/env'

const firebaseConfig: firebase.FirebaseOptions = {
  apiKey: env.VITE_APP_API_KEY,
  authDomain: env.VITE_APP_AUTH_DOMAIN,
  projectId: env.VITE_APP_PROJECT_ID,
  storageBucket: env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: env.VITE_APP_MESSAGING_SENDER_ID,
  appId: env.VITE_APP_APP_ID,
}

const app = firebase.initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
