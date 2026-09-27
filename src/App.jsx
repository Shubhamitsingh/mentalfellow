import { AppProviders } from '@/contexts/AppProviders'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}
