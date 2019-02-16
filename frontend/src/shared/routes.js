import nextRoutes from 'next-routes';
import { authGuard, noAuthGuard } from './guards';

const routes = nextRoutes();

routes
    .add({
        name: 'sign-up',
        pattern: '/sign-up',
        canActivate: [noAuthGuard({ redirectTo: '/records' })]
    })
    .add({
        name: 'records',
        pattern: '/records',
        canActivate: [authGuard({ redirectTo: '/sign-up' })]
    })
    .add({
        name: 'reports',
        pattern: '/reports',
        canActivate: [authGuard({ redirectTo: '/sign-up' })]
    });

export default routes;

export const { Router, Link } = routes;
