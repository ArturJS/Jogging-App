import nextRoutes from 'next-routes';

const routes = nextRoutes();

routes
    .add({
        name: 'sign-up',
        pattern: '/sign-up',
        onlyForUnauthenticated: {
            redirectTo: '/records'
        }
    })
    .add({
        name: 'records',
        pattern: '/records',
        onlyForAuthenticated: {
            redirectTo: '/sign-up'
        }
    })
    .add({
        name: 'reports',
        pattern: '/reports',
        onlyForAuthenticated: {
            redirectTo: '/sign-up'
        }
    });

export default routes;

export const { Router, Link } = routes;
