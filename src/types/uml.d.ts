declare namespace Database {
    export interface Table {
        name: string;
        columns: Column[];
    }

    export interface Column {
        name: string;
        type: string;
        marker: string;
        key: string;
        selected?: boolean;
    }
}
