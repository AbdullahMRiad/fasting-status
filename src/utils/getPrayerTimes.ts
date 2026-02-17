export default async function getPrayerTimes({
    longitude,
    latitude,
    date,
    iso8601,
}: {
    longitude: number | null;
    latitude: number | null;
    date: string;
    iso8601: boolean;
}) {
    // construct URL
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&iso8601=${iso8601}`;
    const data = await fetch(url).then((r) => r.json());

    return data;
}
