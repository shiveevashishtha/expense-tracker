const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");

const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Set default date = today
dateInput.valueAsDate = new Date();

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(v => v > 0).reduce((acc, v) => acc + v, 0).toFixed(2);
  const expense = (amounts.filter(v => v < 0).reduce((acc, v) => acc + v, 0) * -1).toFixed(2);

  balanceEl.textContent = `₹${total}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="details">
        <span>${t.description} (${t.category})</span>
        <small>${t.date}</small>
      </div>
      <div>
        <span class="amount ${t.amount > 0 ? "income" : "expense"}">
          ${t.amount > 0 ? "+" : "-"}₹${Math.abs(t.amount).toFixed(2)}
        </span>
        <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateSummary();
  renderTransactions();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!description || isNaN(amount) || !category || !date) {
    alert("Please fill in all fields");
    return;
  }

  const transaction = { description, amount, category, date };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateSummary();
  renderTransactions();

  // Reset form (keep today’s date for convenience)
  descInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.valueAsDate = new Date();
});

// Initial load
updateSummary();
renderTransactions();

