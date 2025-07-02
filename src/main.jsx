import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.jsx'
import { useTranslation } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import './i18n/i18n.jsx'

const AppWrapper = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    if (!i18n.language) {
      i18n.changeLanguage('en');
    }

    document.documentElement.lang = i18n.language;

  }, [i18n])

  return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppWrapper />
    </HelmetProvider>
  </React.StrictMode>,
)