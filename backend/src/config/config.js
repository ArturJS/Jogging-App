import { auth } from './modules/auth';
import { env } from './modules/env';
import { server } from './modules/server';
import { db } from './modules/db';

const config = new Proxy(
    {
        ...auth,
        ...env,
        ...server,
        db
        // todo add check that there is no same params in different module configs
        // in order to avoid collisions
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
