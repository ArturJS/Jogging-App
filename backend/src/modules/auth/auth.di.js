import { createDIModule } from 'di-utils';
import { AuthDAL } from './auth.dal';
import { AuthBLL } from './auth.bll';

const PRIVATE_DI_TYPES = {
    AuthDAL: Symbol('AuthDAL')
};

export const AUTH_DI_TYPES = {
    AuthBLL: Symbol('AuthBLL')
};

export const AuthDI = createDIModule({
    providers: [
        {
            type: PRIVATE_DI_TYPES.AuthDAL,
            useClass: AuthDAL
        },
        {
            type: AUTH_DI_TYPES.AuthBLL,
            useClass: AuthBLL,
            dependencies: [PRIVATE_DI_TYPES.AuthDAL]
        }
    ]
});
