import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import IndexPage from './pages/IndexPage'
import Sim01Ladder         from './simulations/Sim01Ladder'
import Sim02NamingSides    from './simulations/Sim02NamingSides'
import Sim03SimilarTriangles from './simulations/Sim03SimilarTriangles'
import Sim04RatioDashboard from './simulations/Sim04RatioDashboard'
import Sim05_45Proof       from './simulations/Sim05_45Proof'
import Sim06_3060Proof     from './simulations/Sim06_3060Proof'
import Sim07Limits         from './simulations/Sim07Limits'
import Sim08ValuesTable    from './simulations/Sim08ValuesTable'
import Sim09Complementary  from './simulations/Sim09Complementary'
import Sim10Identities     from './simulations/Sim10Identities'

// HashRouter works on GitHub Pages without extra server config
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"       element={<IndexPage />} />
        <Route path="/sim/1"  element={<Sim01Ladder />} />
        <Route path="/sim/2"  element={<Sim02NamingSides />} />
        <Route path="/sim/3"  element={<Sim03SimilarTriangles />} />
        <Route path="/sim/4"  element={<Sim04RatioDashboard />} />
        <Route path="/sim/5"  element={<Sim05_45Proof />} />
        <Route path="/sim/6"  element={<Sim06_3060Proof />} />
        <Route path="/sim/7"  element={<Sim07Limits />} />
        <Route path="/sim/8"  element={<Sim08ValuesTable />} />
        <Route path="/sim/9"  element={<Sim09Complementary />} />
        <Route path="/sim/10" element={<Sim10Identities />} />
      </Routes>
    </HashRouter>
  )
}
