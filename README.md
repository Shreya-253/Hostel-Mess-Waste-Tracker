# Hostel Mess Waste Tracker

Built for PromptWars x KickToTech 2026 (Pune). Track: Education & Student Life.

## Problem
Hostel messes cook for every student, but nobody knows who will actually eat, so food gets wasted.

## Solution
Students mark today's breakfast, lunch and dinner as **Eating** or **Skipping** before each meal's cut-off. The mess manager sees the expected headcount per meal and how much food (kg) and money (₹) was saved.

## Features
- Today's Meals screen with today's date
- Eating / Skipping choice for breakfast, lunch and dinner
- Independent cut-off per meal (Breakfast 12:00 AM, Lunch 10:00 AM, Dinner 5:00 PM). Each meal shows Open or Locked
- Manager dashboard: headcount and skips per meal
- Food saved = skips x 0.35 kg, money saved = skips x ₹30
- Student / Manager view switch (no login)
- Data saved in localStorage, so choices survive a refresh

## How to run
1. Download or clone this repo.
2. Open `index.html` in Chrome.
No install, no server and no API keys needed.

## How to test
1. In Student view, mark a meal as Skipping and check that the Manager dashboard updates.
2. Refresh the page and check that your choice is still there.
3. Try changing a meal after its cut-off and check that it stays locked.
4. Check that unanswered students count as Eating (120 students in total).

## Tech
HTML, CSS and vanilla JavaScript. localStorage only. Built with Google Antigravity, planned with Claude, with ChatGPT and Gemini as helpers.

## Honest limits
- Data lives in one browser, so the 120 students are fictional sample data.
- No login: anyone could change choices. A real version needs authentication.
- Cut-offs use the device's clock, which a user could change.
- 0.35 kg and ₹30 per portion are assumed numbers, not measured.
- The app can't check whether a student who chose Eating actually turns up.
- No backend, so there is no sync across devices.

## Future work
Real logins, a backend database, reminders, weekly waste charts, and real portion and cost settings from the mess.