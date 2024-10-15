export declare type HttpQuery = {
    sort: HttpQuerySort;
    limit: number;
    offset: number;
    where: { [key: string]: string };
    filters?: QueryFilter[];
};

export declare type HttpQuerySort = {
    field: string;
    dir: "ASC" | "DESC";
};

export type QueryFilter = {
    parameter?: string;
    operator?: string;
    property: string;
    value: string;
};

/**
 * @see https://jsonapi.org/format/1.1/#document-links
 */
export declare type ApiSuccessLinks = {
    self: string; // current page url, http://example.com/article
    next: string; // next page url, http://example.com/article?offset=2,
    last?: string; // last page url, http://example.com/article?offset=10
    total?: number; // page number
};

/*
 * status:  the HTTP status code applicable to this problem, expressed as a string value
 *
 * code:    an application-specific error code, expressed as a string value.
 *
 * title:   a short, human-readable summary of the problem
 *
 * detail:  a human-readable explanation specific to this occurrence of the problem
 *
 * more:    stack trace
 *
 * @see https://jsonapi.org/format/1.1/#error-objects
 */
export declare type ApiErrorItem = {
    status?: number;
    code?: number | string;
    title: string;
    detail?: string;
    more?: string;
};
