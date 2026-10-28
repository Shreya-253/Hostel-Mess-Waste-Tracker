# PRD: Hostel Mess Waste Tracker

## Problem
The mess cooks for the full hostel every meal. Skipped meals are invisible, so extra food is cooked and wasted.

## Users
- **Student:** wants to tell the mess quickly, without hassle.
- **Mess manager:** wants to know how much to cook.

## Goals
- A student can mark all 3 meals in under 15 seconds.
- The manager sees today's expected headcount at a glance.
- Savings are shown in kg and ₹ so the impact feels real.

## User stories
- As a student, I want to mark Eating or Skipping for today's meals so the mess doesn't cook my share.
- As a student, I want to see each meal's cut-off and status so I know my deadline.
- As a manager, I want the expected headcount per meal so I cook the right amount.
- As a manager, I want to see food and money saved so I can show it matters.

## MVP features
1. Today's Meals screen (breakfast, lunch, dinner: Eating or Skipping)
2. Independent cut-off per meal with Open or Locked status
3. Manager dashboard (headcount and skips per meal)
4. Savings counter (skips x 0.35 kg, skips x ₹30)
5. Student / Manager view switch (no login)

## Rules
- Choices are stored per date, and a new day starts fresh.
- Unanswered students count as Eating.
- 120 fictional students.
- Locking one meal does not lock the others.
- A locked meal cannot be changed, even after a refresh.

## Non-goals
Real logins, backend or database, payments, notifications, real student data, menu planning.

## Tech
HTML, CSS, vanilla JavaScript, localStorage. No backend, no API keys.

## Success measures
- The core flow works end to end in the demo.
- A valid choice changes the dashboard numbers immediately.
- Each meal locks at its own cut-off.
- The app runs cleanly on a fresh browser with no console errors.