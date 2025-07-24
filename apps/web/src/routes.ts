import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ContactUs from './ContactUs';
import PageNotFound from './page-not-found';
import { AppRoutes } from './routes-config';
import { RouteObject } from 'react-router-dom';

interface Route {
  path: string;
  Component: React.ComponentType;
  index?: boolean;
}

export const routes: Route[] = [
  { Component: HomePage, index: true, path: AppRoutes.home() },
  { Component: LoginPage, path: AppRoutes.login() },
  { Component: SignupPage, path: AppRoutes.signup() },
  { Component: ContactUs, path: AppRoutes.contact() },
  { Component: PageNotFound, path: AppRoutes.pageNotFound() },
];
