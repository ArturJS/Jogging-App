import { withHandlers } from 'recompose';

const withRefs = withHandlers(() => {
    const refs = {};

    return {
        setRef: () => (key, value) => {
            refs[key] = value;
        },
        getRef: () => key => refs[key]
    };
});

export default withRefs;
