import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import MatchesPage from './MatchesPage.jsx'
import CreateTeamPage from './CreateTeamPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchesPage />} />
        <Route path="/match/:matchId" element={<CreateTeamPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)