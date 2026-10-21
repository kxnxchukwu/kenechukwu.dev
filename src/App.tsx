import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { Experience } from './components/Experience';
import { BackToHome } from './components/BackToHome';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { NotFound } from './components/NotFound';
import { ThemeToggle } from './components/ThemeToggle';
import { hasPosts } from './content/writing/hasPosts';

// Posts are loaded on demand so they don't add to the bundle for every page
const Writing = lazy(() => import('./components/Writing/Writing'));
const Post = lazy(() => import('./components/Writing/Post'));

function App() {
  const { pathname } = useLocation();
  return (
    <main className="min-h-screen pl-[5%] md:pl-[30%] lg:pl-[35%] pt-[6%] md:pt-[calc(33vh_-_80px)] pb-20">
      <ThemeToggle />
      {pathname !== '/' && <BackToHome />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Experience />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        {hasPosts && (
          <>
            <Route
              path="/writing"
              element={
                <Suspense fallback={null}>
                  <Writing />
                </Suspense>
              }
            />
            <Route
              path="/writing/:slug"
              element={
                <Suspense fallback={null}>
                  <Post />
                </Suspense>
              }
            />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
