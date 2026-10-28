// Confirm the app is loaded on page load
console.log("Hostel Mess Waste Tracker loaded");

// Log configuration values to confirm they are available
console.log("TOTAL_STUDENTS:", TOTAL_STUDENTS);
console.log("PORTION_KG:", PORTION_KG);
console.log("COST_PER_PORTION:", COST_PER_PORTION);
console.log("DEFAULT_CUTOFFS:", DEFAULT_CUTOFFS);
console.log("MEALS:", MEALS);

// Grab references to toggle buttons and section views
const studentBtn = document.getElementById("student-btn");
const managerBtn = document.getElementById("manager-btn");
const studentView = document.getElementById("student-view");
const managerView = document.getElementById("manager-view");

// Switch to Student view
studentBtn.addEventListener("click", function () {
  studentBtn.classList.add("active");
  managerBtn.classList.remove("active");
  studentView.classList.remove("hidden");
  managerView.classList.add("hidden");
});

// Switch to Manager view and refresh dashboard numbers
managerBtn.addEventListener("click", function () {
  managerBtn.classList.add("active");
  studentBtn.classList.remove("active");
  managerView.classList.remove("hidden");
  studentView.classList.add("hidden");
  renderDashboard();
});

// Track current loaded date to detect midnight day changes
let currentLoadedDate = getTodayKey();

// Student choices object for today's meals
const studentChoices = {};

// Initialize student choices from saved data or default to "Eating"
function initStudentChoices() {
  for (let i = 0; i < MEALS.length; i++) {
    studentChoices[MEALS[i]] = "Eating";
  }
  const saved = loadChoices(getTodayKey());
  if (saved) {
    for (let i = 0; i < MEALS.length; i++) {
      const meal = MEALS[i];
      if (saved[meal]) {
        studentChoices[meal] = saved[meal];
      }
    }
  }
}

// Handle student clicking Eating or Skipping for a meal
function handleMealChoice(meal, choice) {
  const success = saveMealChoice(getTodayKey(), meal, choice);
  const saveStatus = document.getElementById("save-status");
  if (success) {
    studentChoices[meal] = choice;
    renderMealCards();
    if (saveStatus) {
      saveStatus.textContent = "Saved ✓";
    }
  } else {
    if (saveStatus) {
      saveStatus.textContent = "This meal is locked, so your choice was not changed.";
    }
    renderMealCards();
  }
}

// Clear #meal-list and build one card per meal in MEALS
function renderMealCards() {
  const cutoffs = getCutoffs();
  const mealList = document.getElementById("meal-list");
  mealList.innerHTML = "";

  for (let i = 0; i < MEALS.length; i++) {
    const meal = MEALS[i];
    const cutoffTime = cutoffs[meal];
    const locked = isMealLocked(meal);

    // Create card container
    const card = document.createElement("div");
    card.className = "meal-card";

    // Meal info column (name, badge, cutoff)
    const infoDiv = document.createElement("div");
    infoDiv.className = "meal-card-info";

    const titleRow = document.createElement("div");
    titleRow.className = "meal-title-row";

    const nameEl = document.createElement("span");
    nameEl.className = "meal-name";
    nameEl.textContent = meal;
    titleRow.appendChild(nameEl);

    const badge = document.createElement("span");
    badge.className = "status-badge " + (locked ? "badge-locked" : "badge-open");
    badge.textContent = locked ? "Locked" : "Open";
    titleRow.appendChild(badge);

    infoDiv.appendChild(titleRow);

    const cutoffEl = document.createElement("span");
    cutoffEl.className = "meal-cutoff";
    cutoffEl.textContent = "Cut-off: " + formatTime(cutoffTime);
    infoDiv.appendChild(cutoffEl);

    card.appendChild(infoDiv);

    // Action buttons container
    const actions = document.createElement("div");
    actions.className = "meal-actions";

    // "Eating" button
    const eatBtn = document.createElement("button");
    eatBtn.type = "button";
    eatBtn.className = "choice-btn eat-btn";
    eatBtn.textContent = "Eating";
    if (studentChoices[meal] === "Eating") {
      eatBtn.classList.add("selected");
    }
    if (locked) {
      eatBtn.disabled = true;
    }
    eatBtn.addEventListener("click", function () {
      handleMealChoice(meal, "Eating");
    });
    actions.appendChild(eatBtn);

    // "Skipping" button
    const skipBtn = document.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "choice-btn skip-btn";
    skipBtn.textContent = "Skipping";
    if (studentChoices[meal] === "Skipping") {
      skipBtn.classList.add("selected");
    }
    if (locked) {
      skipBtn.disabled = true;
    }
    skipBtn.addEventListener("click", function () {
      handleMealChoice(meal, "Skipping");
    });
    actions.appendChild(skipBtn);

    card.appendChild(actions);
    mealList.appendChild(card);
  }
}

// Render the manager dashboard with expected headcounts, skip counts, and savings
function renderDashboard() {
  const dashboardDateEl = document.getElementById("dashboard-date");
  if (dashboardDateEl) {
    dashboardDateEl.textContent = "Date: " + getTodayLabel();
  }

  const skips = getSkipCounts(getTodayKey());
  const dashboardList = document.getElementById("dashboard-list");
  dashboardList.innerHTML = "";

  for (let i = 0; i < MEALS.length; i++) {
    const meal = MEALS[i];
    const skipCount = skips[meal] || 0;
    const expectedCount = TOTAL_STUDENTS - skipCount;

    // Card container
    const card = document.createElement("div");
    card.className = "dashboard-card";

    // Left info container: meal name and extra details
    const infoDiv = document.createElement("div");
    infoDiv.className = "dashboard-card-info";

    const mealTitle = document.createElement("h3");
    mealTitle.className = "dashboard-meal-name";
    mealTitle.textContent = meal;
    infoDiv.appendChild(mealTitle);

    const skipLine = document.createElement("p");
    skipLine.className = "dashboard-stat-line";
    skipLine.textContent = "Skipping: " + skipCount;
    infoDiv.appendChild(skipLine);

    const totalLine = document.createElement("p");
    totalLine.className = "dashboard-stat-line";
    totalLine.textContent = "Out of " + TOTAL_STUDENTS + " students";
    infoDiv.appendChild(totalLine);

    card.appendChild(infoDiv);

    // Right headcount container: big number and label
    const headcountDiv = document.createElement("div");
    headcountDiv.className = "dashboard-headcount";

    const countEl = document.createElement("div");
    countEl.className = "headcount-number";
    countEl.textContent = expectedCount;
    headcountDiv.appendChild(countEl);

    const labelEl = document.createElement("span");
    labelEl.className = "headcount-label";
    labelEl.textContent = "expected to eat";
    headcountDiv.appendChild(labelEl);

    card.appendChild(headcountDiv);

    dashboardList.appendChild(card);
  }

  // Calculate and display food savings summary
  const savingsBox = document.getElementById("savings-box");
  if (savingsBox) {
    const savings = calculateSavings(skips);
    const mealWord = savings.totalSkips === 1 ? "meal skipped" : "meals skipped";

    savingsBox.innerHTML = `
      <h3>Food Saved Today</h3>
      <div class="savings-stats">
        <div class="stat-item">
          <span class="stat-number">${savings.totalSkips}</span>
          <span class="stat-label">${mealWord}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${savings.kgSaved.toFixed(2)}</span>
          <span class="stat-label">kg food saved</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">₹${savings.rupeesSaved}</span>
          <span class="stat-label">saved</span>
        </div>
      </div>
      <p class="savings-note">Estimate: ${PORTION_KG} kg and ₹${COST_PER_PORTION} per skipped meal.</p>
    `;
  }
}

// Display today's date with "Date: " label
const todayDateEl = document.getElementById("today-date");
if (todayDateEl) {
  todayDateEl.textContent = "Date: " + getTodayLabel();
}

// Initialize choices and render initial views on page load
initStudentChoices();
renderMealCards();
renderDashboard();

// Periodically check every 30 seconds for new day or updated cutoff status
setInterval(function () {
  const today = getTodayKey();
  if (today !== currentLoadedDate) {
    currentLoadedDate = today;
    initStudentChoices();
    const dateEl = document.getElementById("today-date");
    if (dateEl) {
      dateEl.textContent = "Date: " + getTodayLabel();
    }
  }
  renderMealCards();
  renderDashboard();
}, 30000);
