import { banner } from "../lib/banner-manager.svelte";
import { settings } from "../lib/settings-manager.svelte";

export default function detectLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                settings.latitude = parseFloat(
                    position.coords.latitude.toFixed(7),
                );
                settings.longitude = parseFloat(
                    position.coords.longitude.toFixed(7),
                );
            },
            (error) => {
                banner.set(
                    "حدث خطأ عند محاولة تحديد الموقع. حاول مرة أخرى أو أدخل الموقع يدويًا.",
                    "error",
                );
                console.error("Geolocation error:", error);
            },
        );
        settings.syncToURL();
    } else {
        banner.set("خدمة تحديد الموقع غير متوفرة", "error");
        console.error("Geolocation is not available");
    }
}
