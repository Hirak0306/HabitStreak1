let goals = JSON.parse(localStorage.getItem("goals")) || [];
renderGoals();

document.addEventListener("keydown", e => { 
    if(e.key === "Enter") addGoal(); 
});

function addGoal(){
    let name = document.getElementById("goalName").value.trim();
    let days = parseInt(document.getElementById("goalDays").value);

    if(!name || !days) return alert("Enter habit & days");

    goals.push({
        name,
        days,
        completed: 0
    });

    document.getElementById("goalName").value="";
    document.getElementById("goalDays").value="";

    save();
}

function save(){
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
}

function renderGoals(){
    const list = document.getElementById("goalList");
    list.innerHTML="";

    goals.forEach((g, i) => {
        let perc = Math.round((g.completed / g.days) * 100) || 0;
        let angle = perc * 3.6;

        list.innerHTML += `
        <div class='goal-card'>
            <div class='circular' style='--angle:${angle}deg;'>
                <span class='perc-text'>${perc}%</span>
            </div>

            <div>${g.name}<br>${g.completed}/${g.days} days</div>

            <div>
                <button class='done-btn' onclick='doneToday(${i})'>✔</button>
                <button class='remove-btn' onclick='removeGoal(${i})'>✖</button>
            </div>
        </div>
        `;
    });
}

function doneToday(i){
    let g = goals[i];

    g.completed++; // allow multiple taps anytime

    if(g.completed >= g.days){
        setTimeout(() => {
            if(confirm("🎉 Congrats! You finished your streak!\nDo you want to extend it?")){
                let extra = parseInt(prompt("How many more days?"));
                if(extra > 0) g.days += extra;
            }
            save();
        }, 200);
    }

    save();
}

function removeGoal(i){
    if(confirm("Delete this habit?")){
        goals.splice(i, 1);
        save();
    }
}
