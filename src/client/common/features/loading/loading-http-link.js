import { ApolloLink } from 'apollo-link';
import loadingStore from './loading.store';

const loadingHttpLink = new ApolloLink((operation, forward) => {
    loadingStore.startLoading();

    return forward(operation).map(response => {
        loadingStore.finishLoading();

        return response;
    });
});

export default loadingHttpLink;
