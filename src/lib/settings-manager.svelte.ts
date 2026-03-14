import { TEXT_FONTS, TIME_FONTS } from "../constants";
import type { TextFont, TimeFont } from "../types";

export class SettingsManager {
    latitude: number | null = $state(null);
    longitude: number | null = $state(null);
    backgroundColor = $state("#ffffff");
    foregroundColor = $state("#ffffff");
    fontSize = $state(128);
    fontWeight = $state(400);
    textFontFamily = $state<TextFont>("Alexandria Variable");
    timeFontFamily = $state<TimeFont>("Bricolage Grotesque Variable");

    constructor() {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);

        this.latitude = params.get("latitude")
            ? parseFloat(params.get("latitude")!)
            : null;
        this.longitude = params.get("longitude")
            ? parseFloat(params.get("longitude")!)
            : null;

        this.backgroundColor = params.get("bg") ?? "#121212";
        this.foregroundColor = params.get("fg") ?? "#ececec";

        this.textFontFamily = TEXT_FONTS.includes(
            (params.get("text_font") as TextFont) ?? "",
        )
            ? (params.get("text_font") as TextFont)
            : "Alexandria Variable";
        this.timeFontFamily = TIME_FONTS.includes(
            (params.get("time_font") as TimeFont) ?? "",
        )
            ? (params.get("time_font") as TimeFont)
            : "Bricolage Grotesque Variable";
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

    syncToURL() {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const defaults = {
            bg: "#121212",
            fg: "#ececec",
            fontSize: window.innerWidth > 780 ? 128 : 64,
            fontWeight: 400,
            textFontFamily: "Alexandria Variable",
            timeFontFamily: "Bricolage Grotesque Variable",
        };

        this.latitude
            ? params.set("latitude", String(this.latitude))
            : params.delete("latitude");
        this.longitude
            ? params.set("longitude", String(this.longitude))
            : params.delete("longitude");

        this.backgroundColor !== defaults.bg
            ? params.set("bg", this.backgroundColor)
            : params.delete("bg");
        this.foregroundColor !== defaults.fg
            ? params.set("fg", this.foregroundColor)
            : params.delete("fg");

        this.fontSize !== defaults.fontSize
            ? params.set("font_size", String(this.fontSize))
            : params.delete("font_size");
        this.fontWeight !== defaults.fontWeight
            ? params.set("font_weight", String(this.fontWeight))
            : params.delete("font_weight");
        this.textFontFamily !== defaults.textFontFamily
            ? params.set("text_font", this.textFontFamily)
            : params.delete("text_font");
        this.timeFontFamily !== defaults.timeFontFamily
            ? params.set("time_font", this.timeFontFamily)
            : params.delete("time_font");

        const url = `${window.location.pathname}?${params.toString()}`;
        console.log("Settigns changed. Current URL:", url);
        window.history.replaceState({}, "", url);
    }
}

export const settings = new SettingsManager();
