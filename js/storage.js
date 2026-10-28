// Returns today's date formatted as "YYYY-MM-DD" using local date parts
function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Returns today's date as a readable string (e.g. "Wednesday, 28 October 2026")
function getTodayLabel() {
  const today = new Date();
  const weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekday = weekdays[today.getDay()];
  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

// Reads meal cutoffs from localStorage, falling back to DEFAULT_CUTOFFS if missing or invalid
function getCutoffs() {
  const cutoffs = {};
  let saved = null;
  try {
    const raw = localStorage.getItem("messTracker_cutoffs");
    if (raw) {
      saved = JSON.parse(raw);
    }
  } catch (error) {
    console.log("Error loading cutoffs from localStorage:", error);
  }

  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  for (let i = 0; i < MEALS.length; i++) {
    const meal = MEALS[i];
    if (saved && typeof saved[meal] === "string" && timeRegex.test(saved[meal])) {
      cutoffs[meal] = saved[meal];
    } else {
      cutoffs[meal] = DEFAULT_CUTOFFS[meal] || "00:00";
    }
  }

  return cutoffs;
}

// Formats "HH:MM" 24-hour time string into readable 12-hour format (e.g. "5:00 PM")
function formatTime(hhmm) {
  if (!hhmm || typeof hhmm !== "string") {
    return "";
  }
  const parts = hhmm.split(":");
  const hour = parseInt(parts[0], 10);
  const minute = parts[1] || "00";
  const period = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) {
    hour12 = 12;
  }
  return `${hour12}:${minute} ${period}`;
}

// Checks if a meal's cutoff time has passed for today
function isMealLocked(meal) {
  const cutoffs = getCutoffs();
  const cutoffTime = cutoffs[meal];
  if (!cutoffTime) {
    return false;
  }

  const parts = cutoffTime.split(":");
  const cutoffMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return currentMinutes >= cutoffMinutes;
}

// Loads saved choices for a specific date from localStorage
function loadChoices(dateKey) {
  try {
    const rawData = localStorage.getItem("messTracker_choices");
    if (!rawData) {
      return null;
    }
    const allChoices = JSON.parse(rawData);
    if (allChoices && typeof allChoices === "object" && allChoices[dateKey]) {
      return allChoices[dateKey];
    }
    return null;
  } catch (error) {
    console.log("Error loading choices from localStorage:", error);
    return null;
  }
}

// Saves a choice for one specific meal on today's date if valid and unlocked
function saveMealChoice(dateKey, meal, choice) {
  try {
    if (!MEALS.includes(meal)) {
      return false;
    }
    if (choice !== "Eating" && choice !== "Skipping") {
      return false;
    }
    if (dateKey !== getTodayKey()) {
      return false;
    }
    if (isMealLocked(meal)) {
      return false;
    }

    const rawData = localStorage.getItem("messTracker_choices");
    let allChoices = {};
    if (rawData) {
      allChoices = JSON.parse(rawData) || {};
    }

    if (!allChoices[dateKey] || typeof allChoices[dateKey] !== "object") {
      allChoices[dateKey] = {};
    }

    allChoices[dateKey][meal] = choice;
    localStorage.setItem("messTracker_choices", JSON.stringify(allChoices));
    return true;
  } catch (error) {
    console.log("Error saving meal choice to localStorage:", error);
    return false;
  }
}

// Returns the count of students skipping each meal for today
function getSkipCounts(dateKey) {
  const key = dateKey || getTodayKey();
  const saved = loadChoices(key);
  const skipCounts = {};

  for (let i = 0; i < MEALS.length; i++) {
    const meal = MEALS[i];
    if (saved && saved[meal] === "Skipping") {
      skipCounts[meal] = 1;
    } else {
      skipCounts[meal] = 0;
    }
  }

  return skipCounts;
}

// Calculates total food and money saved based on skip counts
function calculateSavings(skipCounts) {
  let totalSkips = 0;
  for (let i = 0; i < MEALS.length; i++) {
    const meal = MEALS[i];
    totalSkips += (skipCounts[meal] || 0);
  }

  const kgSaved = Number((totalSkips * PORTION_KG).toFixed(2));
  const rupeesSaved = Math.round(totalSkips * COST_PER_PORTION);

  return {
    totalSkips: totalSkips,
    kgSaved: kgSaved,
    rupeesSaved: rupeesSaved
  };
}
