import { IntlProvider } from 'react-intl'
import { Route, Routes } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'balloon-css/balloon.min.css'
import 'core-js/features/set-immediate'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'semantic-ui-css/semantic.min.css'

import Layout from '../components/Layout/Layout'
import en from '../intl/en.json'
import HomePage from '../pages'
import ProjectsPage from '../pages/projects'
import ProposalsPage from '../pages/proposals'
import '../theme.css'
import '../ui-overrides.css'
import { flattenMessages } from '../utils/intl'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider defaultLocale="en" locale="en" messages={flattenMessages(en)}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </Layout>
      </IntlProvider>
    </QueryClientProvider>
  )
}

export default App
