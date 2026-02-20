export class SettingsManager {
    locationMode: "auto" | "manual" = $state("auto");
    latitude: number | null = $state(null);
    longitude: number | null = $state(null);
    backgroundColor = $state("#ffffff");
    foregroundColor = $state("#ffffff");
    fontSize = $state(128);
    fontWeight = $state(400);
    fontFamily = $state("Bricolage Grotesque Variable, Kufam Variable");

    constructor() {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);

        this.locationMode =
            params.get("location_mode") === "manual" ? "manual" : "auto";
        this.latitude = params.get("latitude")
            ? parseFloat(params.get("latitude")!)
            : null;
        this.longitude = params.get("longitude")
            ? parseFloat(params.get("longitude")!)
            : null;

        this.backgroundColor = params.get("bg") ?? "#121212";
        this.foregroundColor = params.get("fg") ?? "#ececec";

        this.fontFamily =
            params.get("font") ??
            "Bricolage Grotesque Variable, Kufam Variable";
        this.fontSize = params.get("font_size")
            ? parseInt(params.get("font_size")!)
            : window.innerWidth > 780
              ? 128
              : 64;
        this.fontWeight = params.get("font_weight")
            ? parseFloat(params.get("font_weight")!)
            : 400;
    }

    get isCoordsAvailable() {
        return this.latitude !== null && this.longitude !== null;
    }
}
