
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class FilterInput {
    startDate?: Long;
    endDate?: Long;
}

export class RecordInput {
    date: Long;
    distance: number;
    time: number;
}

export abstract class IMutation {
    abstract signIn(email: string, password: string): boolean | Promise<boolean>;

    abstract signUp(firstName: string, lastName: string, email: string, password: string): boolean | Promise<boolean>;

    abstract signOut(): boolean | Promise<boolean>;

    abstract addRecord(record: RecordInput): Record | Promise<Record>;

    abstract updateRecord(id: number, record: RecordInput): Record | Promise<Record>;

    abstract deleteRecord(id: number): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract records(filter?: FilterInput): Record[] | Promise<Record[]>;

    abstract record(id: number): Record | Promise<Record>;

    abstract reports(): Report[] | Promise<Report[]>;
}

export class Record {
    id: number;
    date: Long;
    distance: number;
    time: number;
    averageSpeed: number;
}

export class Report {
    week: number;
    averageDistance: number;
    averageSpeed: number;
}

export type Long = any;