export interface Page<T> {
    records: Array<T>,
    current: number,
    pages: number
}