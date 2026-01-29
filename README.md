# Closeup Love Tunes

A Valentine's Day campaign web app by Hindustan Unilever (HUL) that generates personalized AI music videos. Users select preferences, upload a photo, verify via WhatsApp OTP, and receive a custom video on WhatsApp within ~20 minutes.

**Live:** https://closeuplovetunes.in
**Campaign Period:** Jan 27 - Feb 14, 2026

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, CSS Variables |
| Font | Geologica (Google Fonts via `next/font`) |
| Animations | Lottie (`lottie-react`), CSS transitions |
| Face Detection | `face-api.js` (TinyFaceDetector + FaceLandmark68Net) |
| Icons | `lucide-react` |
| Notifications | `react-toastify` |
| Analytics | Google Tag Manager (`@next/third-parties`) |
| Deployment | Custom server on port 8101 |

---

## Getting Started

```bash
npm install
npm run dev       # Development server (localhost:3000)
npm run build     # Production build
npm run start     # Production server (localhost:8101)
```

---

## Directory Structure

```
closeup-frontend/
├── app/
│   ├── layout.tsx                # Root layout (font, metadata, GTM)
│   ├── globals.css               # Tailwind imports, CSS variables
│   ├── page.tsx                  # Landing page (/)
│   ├── input/
│   │   └── page.tsx              # Main form page (/input)
│   ├── thank-you/
│   │   └── page.tsx              # Confirmation page (/thank-you)
│   ├── terms/
│   │   └── page.tsx              # Terms & conditions (/terms)
│   └── components/
│       └── Dropdown.tsx          # Reusable dropdown select component
├── public/
│   ├── closeup/                  # Brand SVGs and logos
│   ├── models/                   # face-api.js ML model weights
│   ├── og/                       # OpenGraph image
│   ├── *.png, *.gif              # UI assets (decorations, icons, instructions)
│   └── thanks-json-*.json        # Lottie animations (mobile/tablet/desktop)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Pages & User Flow

```
Landing (/)  →  Input Form (/input)  →  Thank You (/thank-you)
                     ↓
              Terms & Conditions (/terms)
```

### 1. Landing Page — `app/page.tsx`

Animated hero with staggered SVG letter animations spelling "LOVE TUNES". Displays a Lottie background animation (responsive: mobile/tablet/desktop variants). A "Start" CTA routes to `/input`.

### 2. Input Page — `app/input/page.tsx`

The core of the app. Has three sequential screens within a single page:

**Screen 1 — Preference Form:**
- 4 dropdown selections:
  - **Love About:** Smile, Eyes, Hair, Face, Vibe, Sense of Humor, Heart
  - **Relationship:** Dating, Married, Long-Distance, Crushing, Situationship, Nanoship
  - **Vibe:** Romantic, Rock, Rap
  - **Voice:** Female voice, Male voice
- All fields required before proceeding

**Screen 2 — Photo + Mobile Number:**
- Camera modal with live face detection (face-api.js)
- Validates face: centered position, 20-80% frame size, both eyes + nose + mouth visible
- Server-side photo validation via API
- 10-digit WhatsApp number input
- Terms & conditions checkbox

**Screen 3 — OTP Verification:**
- 6-digit OTP sent to WhatsApp
- 5-minute countdown timer
- Resend available after timer expires
- On success, redirects to `/thank-you`

### 3. Thank You Page — `app/thank-you/page.tsx`

Lottie animation + confirmation message: "Your Closeup Love Tunes Video is on its way! It'll be hitting your WhatsApp in just 20 minutes." Home button returns to landing.

### 4. Terms Page — `app/terms/page.tsx`

Full legal T&C document covering campaign rules, eligibility (18+), IP rights, privacy, and 3-video-per-user limit.

---

## Components

### `Dropdown` — `app/components/Dropdown.tsx`

Reusable controlled dropdown with:
- `items: string[]` — options list
- `value?: string` — controlled value
- `onSelect?: (item: string) => void` — selection callback
- `onOpenChange?: (isOpen: boolean) => void` — open state callback
- Click-outside-to-close behavior
- Texture background overlay (`texture.png`)

---

## Backend API

All API calls go to the external backend at `https://api.closeuplovetunes.in/api/v1`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/video/submit` | Submit form data + photo. Returns `otp_sent`, `video_created`, or `pending`. 403 if 3-video limit exceeded. |
| POST | `/auth/verify-otp` | Verify 6-digit OTP. Body: `{ mobile_number, otp }` |
| POST | `/auth/resend-otp` | Resend OTP. Body: `{ mobile_number }` |
| POST | `/photo-validation/check_photo` | Server-side photo validation. Returns `{ valid, message, reason }` |

### Form Data Sent to `/video/submit`

```
mobile_number       — 10-digit string
gender              — "male" | "female" (mapped from voice selection)
attribute_love      — selected love attribute
relationship_status — selected relationship type
vibe                — "romantic" | "rock" | "rap" (lowercased)
photo               — image file (JPEG from camera capture)
terms_accepted      — "true" | "false"
```

---

## Face Detection

Uses `face-api.js` with two models loaded from `/public/models/`:

- **TinyFaceDetector** — lightweight face detection
- **FaceLandmark68Net** — 68-point facial landmark detection

Detection runs every 200ms during camera capture and validates:
- Face is present in frame
- Face is horizontally centered (25-75% of frame)
- Face is vertically positioned (15-85% of frame)
- Face occupies 20-80% of frame width
- All key landmarks visible: left eye, right eye, nose, mouth

Falls back from WebGL to CPU backend if needed.

---

## Styling & Theming

**CSS Variables** (`globals.css`):
```css
--primary: #D21F32   /* Closeup brand red */
--foreground: #fff   /* White text */
```

**Color Palette:**
- Primary: `#D21F32` (brand red)
- Dark variant: `#BE1E2D`
- Light pink: `#FCAAA4`, `#FFD9DB`
- Backgrounds: black, white

**Responsive Breakpoints** (used in JS, not Tailwind):
- Mobile: `< 700px`
- Tablet: `700px - 1199px`
- Desktop: `>= 1200px`

Used to select the correct Lottie animation variant per screen size.

---

## State Management

Pure React hooks — no external state library.

- `useState` — all form fields, UI toggles, loading states
- `useRef` — video element, face detection interval, canvas
- `useCallback` — memoized face detection and camera functions
- `useEffect` — timers (OTP countdown), event listeners, animation triggers

No global state needed since the app is a linear single-flow form.

---

## Key State Variables (Input Page)

| State | Type | Purpose |
|-------|------|---------|
| `loveAbout`, `relationship`, `vibe`, `voice` | `string` | Form selections |
| `showMobileInput` | `boolean` | Toggle between form and photo/mobile screen |
| `mobileNumber` | `string` | WhatsApp number (10 digits) |
| `capturedPhoto` / `capturedPhotoFile` | `string` / `File` | Confirmed photo |
| `previewPhoto` / `previewPhotoFile` | `string` / `File` | Photo before confirmation |
| `agreedToTerms` | `boolean` | T&C acceptance |
| `showCamera` / `showPreCamera` | `boolean` | Camera modal states |
| `preCameraProgress` | `number` | 4-step instruction progress |
| `faceDetected` / `modelsLoaded` | `boolean` | Face detection status |
| `isSubmitting` / `isVerifyingOtp` / `isResendingOtp` | `boolean` | Loading states |
| `otpCode` | `string` | Entered OTP |
| `otpTimer` | `number` | Countdown seconds (starts at 300) |
| `jobId` | `number \| null` | Backend job ID for video generation |

---

## Analytics

- **Google Tag Manager:** `GTM-NK2Q4ZM3` (active, loaded in `layout.tsx`)
- **Google Analytics:** `G-FZLSKM6970` (commented out in `layout.tsx`)

---

## Authentication

Phone-based OTP via WhatsApp. No user accounts, no passwords, no JWT tokens. The mobile number serves as the user identifier. Rate-limited to 3 videos per phone number.

---

## Assets

| Type | Location | Notes |
|------|----------|-------|
| Brand SVGs | `/public/closeup/` | Logo, animated letter sprites |
| ML Models | `/public/models/` | ~550KB total, loaded on-demand |
| Lottie JSON | `/public/thanks-json-*.json` | 3 variants (mobile/tablet/desktop) |
| UI Images | `/public/*.png` | Decorative hearts, stars, camera icons |
| Animated GIF | `/public/disc.gif` | ~10MB (large, impacts load time) |
| OG Image | `/public/og/red-logo.png` | Social sharing preview |

---

## Utility Functions (in `app/input/page.tsx`)

| Function | Purpose |
|----------|---------|
| `formatTime(seconds)` | Formats OTP countdown as `M:SS` |
| `dataURLtoFile(dataurl, filename)` | Converts base64 canvas capture to `File` object |
| `verifyPhoto(file)` | Calls backend photo validation API |
| `loadFaceDetectionModels()` | Loads TensorFlow.js backend + face-api.js models |
| `startFaceDetection()` | Runs face detection loop every 200ms |

---

## Metadata & SEO

Defined in `app/layout.tsx`:

```
Title: Closeup Love Tunes - Create Your Valentine's Song
Description: Create a personalized love song for your valentine with Closeup Love Tunes
OG Image: /og/red-logo.png
Base URL: https://closeuplovetunes.in
```

---

## Notes for Developers

- **No `.env` file** — API URL and analytics IDs are hardcoded. Consider extracting to environment variables for multi-environment support.
- **No API routes** — This is a pure frontend app; all backend logic lives at `api.closeuplovetunes.in`.
- **Single reusable component** — Only `Dropdown.tsx` is extracted. The input page is a large (~700 line) monolithic component.
- **No tests** — No test files or testing libraries are present.
- **No global state** — Each page manages its own state via hooks. There is no need for context or a state library given the linear user flow.
- **Large GIF asset** — `disc.gif` is ~10MB; consider converting to a video or optimized format.
