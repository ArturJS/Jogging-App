import pathToRegexp from 'path-to-regexp';
import { toQueryString } from './utils';

export class Route {
    constructor({ name, pattern, page = name, canActivate }) {
        if (!name && !page) {
            throw new Error(`Missing page to render for route "${pattern}"`);
        }

        this.name = name;
        this.pattern = pattern || `/${name}`;
        this.page = page.replace(/(^|\/)index$/, '').replace(/^\/?/, '/');
        this.regex = pathToRegexp(this.pattern, (this.keys = []));
        this.keyNames = this.keys.map(key => key.name);
        this.toPath = pathToRegexp.compile(this.pattern);
        this.canActivate = canActivate;
    }

    match(path) {
        const values = this.regex.exec(path);

        if (values) {
            return this.valuesToParams(values.slice(1));
        }

        return null;
    }

    valuesToParams(values) {
        return values.reduce((params, val, i) => {
            if (val === undefined) {
                return params;
            }

            return Object.assign(params, {
                [this.keys[i].name]: decodeURIComponent(val)
            });
        }, {});
    }

    getHref(params = {}) {
        return `${this.page}?${toQueryString(params)}`;
    }

    getAs(params = {}) {
        const as = this.toPath(params) || '/';
        const keys = Object.keys(params);
        const qsKeys = keys.filter(key => this.keyNames.indexOf(key) === -1);

        if (!qsKeys.length) {
            return as;
        }

        const qsParams = qsKeys.reduce(
            (qs, key) =>
                Object.assign(qs, {
                    [key]: params[key]
                }),
            {}
        );

        return `${as}?${toQueryString(qsParams)}`;
    }

    getUrls(params) {
        const as = this.getAs(params);
        const href = this.getHref(params);

        return {
            as,
            href
        };
    }
}
