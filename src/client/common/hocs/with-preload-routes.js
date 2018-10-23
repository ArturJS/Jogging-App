import { lifecycle } from 'recompose';
import { Router } from 'routes';

const withPreloadRoutes = ({ routes }) => {
  return lifecycle({
    componentDidMount() {
      routes.forEach(route => {
        Router.prefetchRoute(route);
      });
    }
  });
};

export default withPreloadRoutes;
