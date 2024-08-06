
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/styles/main.scss'
import { HomePage } from './pages/HomePage'
import { Header } from './cmps/Header'

export function App() {

  return (
      <Router>
        <Header/>
        <Routes>
          <Route element={<HomePage />} path="/" />
        </Routes>
      </Router>
  )
}

