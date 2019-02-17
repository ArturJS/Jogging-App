import { Container } from 'inversify';

export const createDIContainer = ({ modules }) => {
    const container = new Container({
        defaultScope: 'Singleton'
    });

    container.load(...modules);

    return container;
};
