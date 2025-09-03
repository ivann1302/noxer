import MainPage from './pages/MainPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  )
}

export default App
