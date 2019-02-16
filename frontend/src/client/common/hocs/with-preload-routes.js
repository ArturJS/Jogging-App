import { lifecycle } from 'recompose';
import { Router } from 'routes';

const withPreloadRoutes = ({ routes }) =>
    lifecycle({
        componentDidMount() {
            routes.forEach(route => {
                Router.prefetchRoute(route);
            });
        }
    });

export default withPreloadRoutes;
