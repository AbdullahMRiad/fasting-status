import { TEXT_FONTS, TIME_FONTS } from "../constants";
import type { TextFont, TimeFont } from "../types";

export class SettingsManager {
    defaults = {
        latitude: null,
        longitude: null,
        backgroundColor: "#121212",
        foregroundColor: "#ececec",
        fontSize: window.innerWidth > 780 ? 128 : 64,
        fontWeight: 400,
        textFontFamily: "Alexandria Variable",
        timeFontFamily: "Bricolage Grotesque Variable",
        spacing: 0,
        reverse: false,
    };

    latitude: number | null = $state(this.defaults.latitude);
    longitude: number | null = $state(this.defaults.longitude);
    backgroundColor = $state(this.defaults.backgroundColor);
    foregroundColor = $state(this.defaults.foregroundColor);
    fontSize = $state(this.defaults.fontSize);
    fontWeight = $state(this.defaults.fontWeight);
    textFontFamily = $state<TextFont>(this.defaults.textFontFamily as TextFont);
    timeFontFamily = $state<TimeFont>(this.defaults.timeFontFamily as TimeFont);
    spacing = $state(this.defaults.spacing);
    reverse = $state(this.defaults.reverse);

    constructor() {
        if (typeof window === "undefined") return;

        const params = Object.fromEntries(
            new URLSearchParams(window.location.search),
        );

        params.latitude && (this.latitude = parseFloat(params.latitude));
        params.longitude && (this.longitude = parseFloat(params.longitude));

        params.bg && (this.backgroundColor = params.bg);
        params.fg && (this.foregroundColor = params.fg);

        params.text_font &&
            TEXT_FONTS.includes(params.text_font) &&
            (this.textFontFamily = params.text_font);
        params.time_font &&
            TIME_FONTS.includes(params.time_font) &&
            (this.timeFontFamily = params.time_font);

        params.font_size && (this.fontSize = parseFloat(params.font_size));
        params.font_weight &&
            (this.fontWeight = parseFloat(params.font_weight));

        params.spacing && (this.spacing = parseFloat(params.spacing));

        params.reverse &&
            parseFloat(params.reverse) === 1 &&
            (this.reverse = true);
    }

    get isCoordsAvailable() {
        return this.latitude !== null && this.longitude !== null;
    }

    syncToURL() {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);

        this.latitude !== this.defaults.latitude
            ? params.set("latitude", String(this.latitude))
            : params.delete("latitude");
        this.longitude !== this.defaults.longitude
            ? params.set("longitude", String(this.longitude))
            : params.delete("longitude");

        this.backgroundColor !== this.defaults.backgroundColor
            ? params.set("bg", this.backgroundColor)
            : params.delete("bg");
        this.foregroundColor !== this.defaults.foregroundColor
            ? params.set("fg", this.foregroundColor)
            : params.delete("fg");

        this.fontSize !== this.defaults.fontSize
            ? params.set("font_size", String(this.fontSize))
            : params.delete("font_size");
        this.fontWeight !== this.defaults.fontWeight
            ? params.set("font_weight", String(this.fontWeight))
            : params.delete("font_weight");
        this.textFontFamily !== this.defaults.textFontFamily
            ? params.set("text_font", this.textFontFamily)
            : params.delete("text_font");
        this.timeFontFamily !== this.defaults.timeFontFamily
            ? params.set("time_font", this.timeFontFamily)
            : params.delete("time_font");

        this.spacing !== this.defaults.spacing
            ? params.set("spacing", String(this.spacing))
            : params.delete("spacing");

        this.reverse !== this.defaults.reverse
            ? params.set("reverse", "1")
            : params.delete("reverse");
        const url = `${window.location.pathname}?${params.toString()}`;
        console.log("Settigns changed. Current URL:", url);
        window.history.replaceState({}, "", url);
    }
}

export const settings = new SettingsManager();
