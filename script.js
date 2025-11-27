// script.js (full, replace previous version)
(() => {
    // --- Data & quotes ---
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
  
    const quotes = [
      "Small steps lead to big results!",
      "Your only limit is your mind 💪",
      "Another day, another victory!",
      "You're becoming the best version of yourself ✨",
      "Dedication always wins 🔥",
      "Keep going — progress compounds!",
      "One more day. One more win."
    ];
  
    // --- Utility ---
    const todayDate = () => new Date().toDateString();
  
    function save() {
      localStorage.setItem("goals", JSON.stringify(goals));
      renderGoals();
    }
  
    // --- Add goal ---
    function addGoal() {
      const name = (document.getElementById("goalName") || {}).value?.trim();
      const daysRaw = (document.getElementById("goalDays") || {}).value;
      const days = parseInt(daysRaw, 10);
  
      if (!name || !days || days <= 0) {
        return alert("Please enter a habit name and a positive number of days.");
      }
  
      goals.push({
        name,
        days,
        completed: 0,
        lastUpdated: "" // store date string of last completed day
      });
  
      // clear inputs
      document.getElementById("goalName").value = "";
      document.getElementById("goalDays").value = "";
      save();
    }
  
    // --- Render UI ---
    function renderGoals() {
      const container = document.getElementById("goalList");
      if (!container) return;
  
      container.innerHTML = "";
  
      goals.forEach((g, i) => {
        const perc = Number.isFinite(g.days) && g.days > 0
          ? Math.round((g.completed / g.days) * 100)
          : 0;
        const safePerc = Math.max(0, Math.min(100, perc));
        const angle = safePerc * 3.6; // degrees
  
        // streak message (next day index)
        const streakMsg = g.completed > 0
          ? `🔥 Into day ${g.completed + 1} streak!`
          : "Start your streak today!";
  
        // build HTML
        const card = document.createElement("div");
        card.className = "goal-card";
        card.innerHTML = `
          <div class="circular" style="--angle: ${angle}deg;">
            <span class="perc-text">${safePerc}%</span>
          </div>
  
          <div class="goal-info">
            <b>${escapeHtml(g.name)}</b><br>
            ${g.completed}/${g.days} days<br>
            <small>${streakMsg}</small>
          </div>
  
          <div class="goal-actions">
            <button class="done-btn" data-i="${i}">✔</button>
            <button class="remove-btn" data-i="${i}">✖</button>
          </div>
        `;
  
        container.appendChild(card);
      });
  
      // attach event listeners (delegated)
      container.querySelectorAll(".done-btn").forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-i"), 10);
          doneToday(idx);
        };
      });
  
      container.querySelectorAll(".remove-btn").forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-i"), 10);
          removeGoal(idx);
        };
      });
    }
  
    // small helper to avoid XSS if names come from inputs
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  
    // --- Mark done for today ---
    function doneToday(i) {
      const g = goals[i];
      if (!g) return;
  
      const today = todayDate();
  
      //if (g.lastUpdated === today) {
       // alert("Already completed for today 😃");
        //return;
      //}
  
      // increment
      g.completed = (g.completed || 0) + 1;
      g.lastUpdated = today;
  
      // short motivational pop
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      // Use a nicer non-blocking modal if available; fallback to alert
      setTimeout(() => alert(quote), 50);
  
      // If reached target
      if (g.completed >= g.days) {
        // small delay so UI updates first
        setTimeout(() => {
          const keep = confirm(
            `🎉 Congrats for completing "${g.name}"!\n\nYou finished ${g.days} day(s).\n\nWould you like to keep it on for some more days?`
          );
          if (keep) {
            const extraRaw = prompt("How many more days would you like to add?", "7");
            const extra = parseInt(extraRaw, 10);
            if (extra && extra > 0) {
              g.days = g.days + extra;
              alert(`Added ${extra} more day(s). New target: ${g.days} days.`);
            } else {
              alert("No extra days added.");
            }
          } else {
            alert("Amazing work — feel proud! 🎉");
          }
          save();
        }, 200);
      } else {
        // save & re-render
        save();
      }
    }
  
    // --- Remove a goal ---
    function removeGoal(i) {
      if (!goals[i]) return;
      const ok = confirm(`Remove goal "${goals[i].name}"?`);
      if (!ok) return;
      goals.splice(i, 1);
      save();
    }
  
    // --- Keyboard: Enter to add ---
    function attachEnter() {
      document.addEventListener("keydown", (e) => {
        // Allow Enter only when focus is on inputs (so forms behave normally)
        const active = document.activeElement;
        const isInput = active && (active.id === "goalName" || active.id === "goalDays");
        if (e.key === "Enter" && isInput) {
          e.preventDefault();
          addGoal();
        }
      });
    }
  
    // --- Init ---
    function init() {
      // Attach add button
      const addBtn = document.querySelector(".add-btn");
      if (addBtn) addBtn.onclick = addGoal;
  
      attachEnter();
      renderGoals();
    }
  
    // run init on DOM ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  
    // expose for debugging (optional)
    window._habitApp = {
      addGoal, doneToday, removeGoal, save, getGoals: () => goals
    };
  })();
  