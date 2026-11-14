export type Unit = { x: number; y: number; z: number; lat: number; lon: number };

export function fibonacciSphere(n: number): Unit[] {
  const GA = Math.PI * (3 - Math.sqrt(5));
  const out: Unit[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * GA;
    const x = Math.cos(theta) * rad;
    const z = Math.sin(theta) * rad;
    out.push({
      x,
      y,
      z,
      lat: (Math.asin(y) * 180) / Math.PI,
      lon: (Math.atan2(x, z) * 180) / Math.PI,
    });
  }
  return out;
}

export function sphereMetrics(w: number, h: number) {
  const hr = w <= 380 ? 0.38 : w <= 640 ? 0.42 : 0.46;
  const wr = w <= 380 ? 0.48 : w <= 640 ? 0.52 : 0.58;
  const floor = w <= 380 ? 108 : w <= 640 ? 120 : 155;
  const R = Math.max(floor, Math.min(500, h * hr, w * wr));
  const cw = Math.round(Math.max(72, R * 0.5));
  const persp = w <= 380 ? 620 : w <= 640 ? 760 : w <= 900 ? 920 : 1150;
  const decodeMax = w <= 380 ? 420 : w <= 640 ? 520 : w <= 900 ? 640 : 760;
  return { R, cw, persp, decodeMax };
}

/** Downscale an image once on a canvas; falls back to the original URL. */
export function downscale(src: string, max: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      const nw = img.naturalWidth || 0;
      if (!nw || nw <= max) return resolve(src);
      try {
        const scale = max / nw;
        const c = document.createElement("canvas");
        c.width = Math.round(nw * scale);
        c.height = Math.round(img.naturalHeight * scale);
        const ctx = c.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : src), "image/webp", 0.88);
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}
