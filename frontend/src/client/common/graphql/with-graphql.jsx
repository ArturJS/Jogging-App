import { withApollo } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import _ from 'lodash';

const withGraphql = ({
    gql,
    name,
    refetchQueries,
    mapResponseData = _.identity,
    errorPolicy = 'all'
}) =>
    compose(
        withApollo,
        mapProps(props => ({
            ...props,
            [name]: async variables => {
                const isQuery =
                    _.get(gql, 'definitions[0].operation') === 'query';
                const requestType = isQuery ? 'query' : 'mutation';
                const operationName = isQuery ? 'query' : 'mutate';
                const { errors, data } = await props.client[operationName]({
                    [requestType]: gql,
                    variables,
                    refetchQueries,
                    errorPolicy
                });

                const error = _.get(errors, '[0].message');

                if (error) {
                    throw error;
                }

                return mapResponseData(data, props);
            }
        }))
    );

export default withGraphql;
