const equipment = [
  { id: 1, name: "Folding Chair", price: 2.50 },
  { id: 2, name: "Round Table", price: 7.00 },
  { id: 3, name: "Party Tent", price: 45.00 },
  { id: 4, name: "String Lights", price: 5.00 },
  { id: 5, name: "Portable Speaker", price: 20.00 }
];

let cart = [];

const equipmentList = document.getElementById("equipment-list");
const estimateList = document.getElementById("estimate-list");
const totalDisplay = document.getElementById("total");
const daysInput = document.getElementById("days");

function displayEquipment() {
  equipmentList.innerHTML = "";

  equipment.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)} per day</div>
      </div>

      <div>
        <label>Qty:</label>
        <input type="number" id="qty-${item.id}" min="1" value="1">
        <button onclick="addItem(${item.id})">Add</button>
      </div>
    `;

    equipmentList.appendChild(div);
  });
}

function addItem(id) {
  const item = equipment.find(e => e.id === id);
  const quantityInput = document.getElementById(`qty-${id}`);
  let quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  const existingItem = cart.find(c => c.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity
    });
  }

  updateEstimate();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateEstimate();
}

function changeQuantity(id, newQuantity) {
  const item = cart.find(c => c.id === id);
  let quantity = parseInt(newQuantity);

  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  item.quantity = quantity;
  updateEstimate();
}

function updateEstimate() {
  const days = Math.max(1, parseInt(daysInput.value) || 1);
  daysInput.value = days;

  estimateList.innerHTML = "";

  if (cart.length === 0) {
    estimateList.innerHTML = "<p>No items selected yet.</p>";
    totalDisplay.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity * days;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "estimate-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        ${item.quantity} × $${item.price.toFixed(2)} × ${days} day(s)
      </div>

      <div>
        <input 
          type="number" 
          min="1" 
          value="${item.quantity}" 
          onchange="changeQuantity(${item.id}, this.value)"
        >
      </div>

      <div>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>

      <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
    `;

    estimateList.appendChild(div);
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

daysInput.addEventListener("input", updateEstimate);

displayEquipment();
updateEstimate();
