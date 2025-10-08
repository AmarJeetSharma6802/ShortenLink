
`npm install @clerk/nextjs --legacy-peer-deps`

- Yeh flag npm ko dependencies ko ignore karte hue install karne ka option deta hai, aur isse aapke project mein Clerk successfully install ho sakta hai.


"scripts": {
  "dev": "concurrently \"next dev\" \"electron .\"",
  "build": "next build && electron-packager . SearchLauncher --platform=win32 --arch=x64 --out=dist --overwrite"
}
