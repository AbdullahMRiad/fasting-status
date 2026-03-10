export default function getLuminance(hex: string) {
    const [r, g, b] = hex
        .match(/\w\w/g)!
        .map((x) => parseInt(x, 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
