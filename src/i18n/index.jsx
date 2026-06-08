import { createContext, useContext, useState } from 'react'
import { el } from './el'
import { en } from './en'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('el')
  const t = lang === 'el' ? el : en
  return (
    <LangContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
