
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/styles/main.scss'
import { HomePage } from './pages/HomePage'

export function App() {

  return (
      <Router>
        <Routes>
          <Route element={<HomePage />} path="/" />
        </Routes>
      </Router>
  )
}

