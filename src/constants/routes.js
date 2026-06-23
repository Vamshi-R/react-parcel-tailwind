// Centralized route path definitions.

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  NOT_FOUND: '*',
};

// Links rendered in the navigation bar.
export const NAV_LINKS = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.ABOUT, label: 'About' },
];
