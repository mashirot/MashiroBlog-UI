export interface Page<T> {
    records: Array<T>,
    current: number,
    total: number
}