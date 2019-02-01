import { Container } from 'inversify';

export const createDIContainer = ({ modules }) => {
    const container = new Container({
        defaultScope: 'Singleton'
    });

    console.dir(modules);

    container.load(...modules);

    return container;
};
