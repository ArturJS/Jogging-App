import { performRedirect } from 'next-routes';
import { authService } from '../services';

export const authGuard = ({ redirectTo }) => ctx => {
    const isLoggedIn = authService.isLoggedIn();

    if (ctx && !isLoggedIn) {
        // perform redirect on server side
        const { req, res } = ctx;

        performRedirect({
            req,
            res,
            redirectTo
        });
    }

    return isLoggedIn;
};
