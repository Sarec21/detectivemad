import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import MainMenu from './screens/MainMenu';
import NotFound from './screens/NotFound';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
