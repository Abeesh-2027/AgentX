export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location isn't available on this device/browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
      (err) => reject(new Error(err.message || "Location permission was denied.")),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

const HERE_WORDS = ["here", "my location", "current location", "where i am"];

export function isHereReference(text) {
  return HERE_WORDS.includes(text.trim().toLowerCase());
}
