import { createBrowserRouter } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import MainMenu from './screens/MainMenu';
import NotFound from './screens/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/menu',
    element: <MainMenu />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
