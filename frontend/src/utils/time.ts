export function formatLocalDateTime(iso: string, options?: Intl.DateTimeFormatOptions) {
    const date = new Date(iso);

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        ...options,
    });
}

export function isoToLocalInput(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
}

export function localInputToIso(value: string) {
    return new Date(value).toISOString();
}
