import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface SidebarProviderProps {
  children: ReactNode
}

interface ToggleExtendedVersionProps {
  disablePin?: boolean
}

interface SidebarContextData {
  isExtendedVersion: boolean
  isFixedVersion: boolean
  toggleExtendedVersion: ({ disablePin }: ToggleExtendedVersionProps) => void
  toggleFixedVersion: () => void
  sidebarWidth: number
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
}

const SidebarContext = createContext({} as SidebarContextData)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExtendedVersion, setIsExtendedVersion] = useState(true)
  const [isFixedVersion, setIsFixedVersion] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)

  const MENU_IS_FIXED_STORAGE_KEY = 'the-brocks.menuIsFixed'

  function toggleFixedVersion() {
    setIsFixedVersion(!isFixedVersion)

    const menuStyleSaved = localStorage.getItem(MENU_IS_FIXED_STORAGE_KEY)
    if (menuStyleSaved) {
      localStorage.removeItem(MENU_IS_FIXED_STORAGE_KEY)
    } else {
      localStorage.setItem(MENU_IS_FIXED_STORAGE_KEY, 'fixed')
    }
  }

  function toggleExtendedVersion({ disablePin }: ToggleExtendedVersionProps) {
    if (disablePin) {
      setIsFixedVersion(false)
      setIsExtendedVersion(!isExtendedVersion)
      localStorage.removeItem(MENU_IS_FIXED_STORAGE_KEY)
      return
    }

    if (!isFixedVersion) {
      setIsExtendedVersion(!isExtendedVersion)
    }
  }

  useEffect(() => {
    const menuStyleSaved = localStorage.getItem(MENU_IS_FIXED_STORAGE_KEY)
    if (menuStyleSaved) {
      setIsFixedVersion(true)
    }
  }, [])

  const providerProps = {
    isExtendedVersion,
    isFixedVersion,
    toggleExtendedVersion,
    toggleFixedVersion,
    sidebarWidth,
    setSidebarWidth,
  }

  return (
    <SidebarContext.Provider value={providerProps}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
