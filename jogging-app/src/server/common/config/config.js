import { auth } from './modules/auth';
import { env } from './modules/env';
import { server } from './modules/server';

const config = new Proxy(
    {
        ...auth,
        ...env,
        ...server
    },
    {
        get(target, name) {
            if (name in target) {
                return target[name];
            }

            throw new Error(
                `Config error! Parameter "${name}" doesn't exist in config!`
            );
        }
    }
);

export default config;
