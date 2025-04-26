async function loadPens() {
  const response = await fetch('config/pens.json');
  const pens = await response.json();

  const penSelect = document.getElementById('penSelect');
  penSelect.innerHTML = ''; // clear old options

  pens.forEach(pen => {
    if (pen.available) {
      const option = document.createElement('option');
      option.value = pen.code;
      option.textContent = pen.name;
      penSelect.appendChild(option);
    }
  });
}

async function loadTrinkets() {
  const response = await fetch('config/trinkets.json');
  const trinkets = await response.json();

  const trinketArea = document.getElementById('trinketArea');
  trinketArea.innerHTML = ''; // clear old trinkets

  trinkets.forEach(trinket => {
    if (trinket.available) {
      const img = document.createElement('img');
      img.src = trinket.image;
      img.alt = trinket.name;
      img.classList.add('trinket-image');
      img.onclick = () => addTrinketToPen(trinket);
      trinketArea.appendChild(img);
    }
  });
}

function addTrinketToPen(trinket) {
  const penCanvas = document.getElementById('penCanvas');
  const img = document.createElement('img');
  img.src = trinket.image;
  img.alt = trinket.name;
  img.classList.add('trinket-on-pen');
  penCanvas.appendChild(img);
}

async function submitCustomization() {
  const selectedPen = document.getElementById('penSelect').value;
  const trinketImages = document.querySelectorAll('#penCanvas img');
  const selectedTrinkets = Array.from(trinketImages).map(img => img.alt);

  const payload = {
    pen: selectedPen,
    trinkets: selectedTrinkets
  };

  try {
    const response = await fetch('https://your-backend-url.onrender.com/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Pen finalized and logged!');
    } else {
      alert('Failed to finalize pen.');
    }
  } catch (err) {
    console.error('Error submitting:', err);
    alert('Error finalizing pen.');
  }
}

window.onload = async () => {
  await loadPens();
  await loadTrinkets();
};
