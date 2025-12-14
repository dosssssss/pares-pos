self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", () => {
  // network-only for now (safe)
});
