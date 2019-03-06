import { ContainerModule } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';

const connectToModule = ({ bind, providers }) => {
    providers.forEach(({ type, useClass, dependencies }) => {
        helpers.annotate(useClass, dependencies);
        bind(type).to(useClass);
    });
};

export const createDIModule = ({ providers }) => {
    const module = new ContainerModule(bind => {
        connectToModule({ bind, providers });
    });

    return module;
};
