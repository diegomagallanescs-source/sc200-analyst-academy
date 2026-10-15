# SC-200 Analyst Academy

A standalone, dark-themed study app for Microsoft SC-200: Microsoft Security Operations Analyst. It includes concept lessons, exam-style questions with answer explanations, a timed mock exam, KQL drills, study progress, and 54 domain-organized flashcards.

## Open the app

Open `outputs/sc200-analyst-academy.html` in any modern browser. The app is fully standalone; it has no build step or runtime dependencies. Microsoft source links inside the app require an internet connection.

## Contents

- `outputs/sc200-analyst-academy.html` — finished standalone app
- `outputs/*.jpg` — UI previews
- `work/` — content source, build utility, and verification scripts

## Verify

From this repository root, run:

```sh
node work/verify.cjs
```

The verification script checks question keys, mock-exam flow, lesson rendering, and the complete flashcard deck.
