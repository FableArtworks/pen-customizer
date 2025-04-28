let placedTrinkets = [];
let currentPenImage = null;

async function loadPens() {
  const response = await fetch('config/pens.json');
  const pens = await response.json();

  const penSelect = document.getElementById('penSelect');
  penSelect.innerHTML = '';

  pens.forEach(pen => {
    if (pen.available) {
      const option = document.createElement('option');
      option.value = pen.code;
      option.textContent = pen.name;
      penSelect.appendChild(option);
    }
  });

  // Automatically load the first pen if available
  if (pens.length > 0) {
    penSelect.value = pens[0].code;
    loadPenBase(pens[0]);
  }

  // Change pen when user selects a different one
  penSelect.addEventListener('change', () => {
    const selected = pens.find(p => p.code === penSelect.value);
    loadPenBase(selected);
  });
}

async function loadTrinkets() {
  const response = await fetch('config/trinkets.json');
  const trinkets = await response.json();

  const trinketArea = document.getElementById('trinketArea');
  trinketArea.innerHTML = '';

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

function loadPenBase(pen) {
  const penCanvas = document.getElementById('penCanvas');
  penCanvas.innerHTML = '';

  const baseImg = document.createElement('img');
  baseImg.src = pen.image;
  baseImg.alt = pen.name;
  baseImg.style.position = 'absolute';
  baseImg.style.top = '0';
  baseImg.style.left = '0';
  baseImg.style.width = '100%';
  baseImg.style.height = 'auto';
  penCanvas.appendChild(baseImg);

  currentPenImage = baseImg;
  placedTrinkets = []; // Clear trinkets when switching pens
}

function addTrinketToPen(trinket) {
  const penCanvas = document.getElementById('penCanvas');
  const quantity = parseInt(document.getElementById('quantitySelect').value);

  for (let i = 0; i < quantity; i++) {
    const img = document.createElement('img');
    img.src = trinket.image;
    img.alt = trinket.name;
    img.classList.add('trinket-on-pen');
    img.style.top = `${30 + (i * 10)}px`;
    img.style.left = `${30 + (i * 10)}px`;
    img.style.position = 'absolute';
    img.style.width = '50px';
    img.style.height = '50px';
    penCanvas.appendChild(img);
    placedTrinkets.push(img);
  }
}

function clearPen() {
  const penCanvas = document.getElementById('penCanvas');
  penCanvas.innerHTML = '';

  if (currentPenImage) {
    penCanvas.appendChild(currentPenImage);
  }

  placedTrinkets = [];
}

function undoLast() {
  const last = placedTrinkets.pop();
  if (last) {
    last.remove();
  }
}

//import { createCustomPenPayment } from 'backend/checkout.jsw'; // ✅ This calls your backend

async function submitCustomization() {
  const selectedPen = document.getElementById('penSelect').value;
  const trinketImages = document.querySelectorAll('#penCanvas img:not(:first-child)');
  const selectedTrinkets = Array.from(trinketImages).map(img => img.alt);

  const customizationData = {
    pen: selectedPen,
    trinkets: selectedTrinkets
  };

  try {
    console.log('Saving customization...');
    const response = await fetch('https://pen-inventory-backend.onrender.com/temp-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customizationData)
    });

    if (response.ok) {
      console.log('Customization saved successfully.');
      const result = await response.json();
      const tempOrderId = result.tempOrderId;
      
      console.log('Sending startCheckout message to parent with tempOrderId:', tempOrderId);
      window.parent.postMessage({ action: "startCheckout", tempOrderId: tempOrderId }, "*");
    } else {
      console.error('Failed to save customization. Server responded not OK.');
      alert('Failed to save customization.');
    }
  } catch (err) {
    console.error('Error saving customization:', err);
    alert('Error saving customization.');
  }
}

window.onload = async () => {
  await loadPens();
  await loadTrinkets();
};
