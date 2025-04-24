
let selectedPen = null;
let selectedTrinkets = [];
let googleScriptUrl = "";

function selectPen(pen) {
    selectedPen = pen;
    document.getElementById("selectedPen").innerText = "Pen: " + pen;
}

function addTrinket(trinket) {
    selectedTrinkets.push(trinket);
    document.getElementById("selectedTrinkets").innerText = "Trinkets: " + JSON.stringify(selectedTrinkets);
}

function submitCustomization() {
    if (!googleScriptUrl) {
        alert("Configuration not loaded yet. Please try again.");
        return;
    }

    const payload = {
        pen: selectedPen,
        trinkets: selectedTrinkets,
        timestamp: new Date().toISOString()
    };

    fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(res => res.text()).then(msg => alert("Submitted: " + msg));
}

window.onload = function () {
    // Load Google Script URL from config
    fetch("config.json")
        .then(res => res.json())
        .then(cfg => {
            googleScriptUrl = cfg.googleScriptUrl;

            // Now load inventory
            return fetch("inventory.json");
        })
        .then(res => res.json())
        .then(data => {
            const penList = document.getElementById("pen-list");
            data.pens.forEach(p => {
                const img = document.createElement("img");
                img.src = p.image;
                img.alt = p.name;
                img.onclick = () => selectPen(p.name);
                penList.appendChild(img);
            });

            const trinketList = document.getElementById("trinket-list");
            data.trinkets.forEach(t => {
                const img = document.createElement("img");
                img.src = t.image;
                img.alt = t.name;
                img.onclick = () => addTrinket(t.name);
                trinketList.appendChild(img);
            });
        });
}
