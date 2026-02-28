<<<<<<< HEAD
# Project Images

Here are some images in this project:

### Image 1
![Image 1](https://drive.google.com/uc?id=1qBRcHUZ7dsXBpagcBbYnMJvQUFux5Ago)

### Image 2
![Image 2](https://drive.google.com/uc?id=1n1kJuOF2CtK-d6pOOI5kFgW_a_M6vLQy)

### Image 3
![Image 3](https://drive.google.com/uc?id=1xgDwl6N4ux7thjYyagrAbSoYi0p188QV)

### Image 4
![Image 4](https://drive.google.com/uc?id=1NEViJuCOKkx1qU_tjw-U9ORBAnEiCyHd)

### Image 5
![Image 5](https://drive.google.com/uc?id=1atIamz235RdmSGhZEMh-PCEjG8OKvjUk)
=======
# SPACK - Twitter-like Clone

This repository contains a full-stack Twitter-like application built with:

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS, styled-components

Features:
- User signup / login with JWT cookie
- Create posts with images
- Follow/unfollow, likes, comments, notifications

Getting started (local):
1. Copy `backend/.env` and set your `MONGO_URI` and other secrets.
2. From project root, install dependencies and start the app:

```powershell
# from project root
npm install
npm run dev
# frontend (if needed separately)
cd frontend
npm install
npm run dev
```

Notes:
- The frontend uses Tailwind CSS and daisyUI; ensure `postcss.config.cjs` and `tailwind.config.js` are present.
- Keep `.env` files out of source control. The repo `.gitignore` already excludes `.env`.

License: MIT
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
