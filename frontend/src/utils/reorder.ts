export function arrayMove<T>(array: T[], from: number, to: number): T[] {
    const next = array.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}
