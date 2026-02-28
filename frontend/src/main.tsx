import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Game from './components/Game'
import Leaderboard from './components/Leaders'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="leaderboard" element={<Leaderboard/>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
