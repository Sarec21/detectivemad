/* eslint-disable */
import { createBrowserRouter } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen.tsx';
import MainMenu from './screens/MainMenu.tsx';
import NotFound from './screens/NotFound.tsx';

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
