import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { Experience } from './components/Experience';
import { BackToHome } from './components/BackToHome';
import { Projects } from './components/Projects';
import { About } from './components/About';

function App() {
  const { pathname } = useLocation();
  return (
    <main className="min-h-screen pl-[5%] md:pl-[30%] lg:pl-[35%] pt-[6%] md:pt-[15%] lg:pt-[25%] pb-20">
      {pathname !== '/' && <BackToHome />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Experience />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </main>
  );
}

export default App;
