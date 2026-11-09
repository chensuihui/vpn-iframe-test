# WeCom VPN iframe PoC

## A: GitHub Pages
Upload `public/index.html` to repository root (or configure Pages to publish `/public`). In Settings > Pages, select Deploy from a branch and the relevant folder. Open `https://YOUR_USERNAME.github.io/REPO/` and enter the internal HTTPS URL.

## B: Internal service
Run on a VPN-reachable server with Node.js:

```bash
cd internal
npm install
ENTRY_ORIGIN=https://YOUR_USERNAME.github.io npm start
```

Reverse proxy the internal HTTPS domain to `http://127.0.0.1:3000` (TLS at proxy). Serve `/result.html` and `/api/request-info` from the same origin. Ensure DNS and VPN routes work on the test device.

### Important
- `frame-ancestors` must list the actual parent **origin**, not the Pages path. Ensure the reverse proxy preserves this CSP and does not inject `X-Frame-Options: DENY/SAMEORIGIN`.
- GitHub Pages and the internal URL are different origins. No cross-origin DOM access is required; results render inside the iframe.
- Avoid `http://` internal URLs because an HTTPS GitHub Pages parent may block mixed-content framing.
- `iframe.onload` is not a reliable network-success signal. Read the result shown inside the frame.
- `remoteAddress` is the direct TCP peer, often a reverse proxy. `X-Forwarded-For` is untrusted unless set by a trusted ingress that strips incoming client-provided values. For VPN egress IP, inspect trusted proxy / ingress logs or headers.
- The API returns request headers, potentially sensitive: use only for a temporary controlled PoC, restrict network access, and remove it afterward.
- If your internal site already has an HTML page and a suitable request-inspection endpoint, you only need the public `index.html` and can point the iframe at the existing internal URL.
