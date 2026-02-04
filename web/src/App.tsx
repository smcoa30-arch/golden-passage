import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Trades } from './pages/Trades';
import { Analytics } from './pages/Analytics';
import { Journal } from './pages/Journal';
import { Learning } from './pages/Learning';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/learning" element={<Learning />} />
      </Routes>
    </Layout>
  );
}

export default App;
