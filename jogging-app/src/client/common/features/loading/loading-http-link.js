import { ApolloLink, Observable } from 'apollo-link';
import loadingStore from './loading.store';

const loadingHttpLink = new ApolloLink((operation, forward) => {
    loadingStore.startLoading();

    return new Observable(observer => {
        forward(operation).subscribe({
            next: result => {
                observer.next(result);
            },
            error: networkError => {
                loadingStore.finishLoading();
                observer.error(networkError);
            },
            complete: () => {
                loadingStore.finishLoading();
                observer.complete();
            }
        });
    });
});

export default loadingHttpLink;
