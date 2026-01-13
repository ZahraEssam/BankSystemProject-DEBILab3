let currentAccount = null;

function createAccountUI() {
  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    password: document.getElementById("password").value,
    initialDeposit: parseFloat(document.getElementById("initialDeposit").value)
  };

  const result = createAccount(data);

  if (typeof result === "string") {
    alert(result); // error message
  } else {
    currentAccount = result;
    alert("Account created successfully!");
    renderAccountInfo();
  }
}


function depositUI() {
  if (!currentAccount) {
    alert("Please create an account first");
    return;
  }

  const amount = Number(document.getElementById("amount").value);
  const result = deposit(currentAccount, amount);

  if (typeof result === "string") {
    alert(result);
    return;
  }

  renderAccountInfo();
}

function withdrawUI() {
  if (!currentAccount) {
    alert("Please create an account first");
    return;
  }

  const amount = Number(document.getElementById("amount").value);
  const result = withdraw(currentAccount, amount);

  if (typeof result === "string") {
    alert(result);
    return;
  }

  renderAccountInfo();
}

function renderAccountInfo() {
  if (!currentAccount) {
    document.getElementById("accountInfo").innerHTML = "No account created yet";
    return;
  }

  const acc = currentAccount;
  let html = `
    <div class="account-details">
      <h3>Account Summary</h3>
      <div class="row"><span>Account Number:</span><span>${acc.accountNumber}</span></div>
      <div class="row"><span>Name:</span><span>${acc.firstName} ${acc.lastName}</span></div>
      <div class="row"><span>Balance:</span><span>$${acc.balance.toFixed(2)}</span></div>
      <div class="row"><span>Status:</span><span>${acc.status}</span></div>
      <div class="row"><span>Created At:</span><span>${new Date(acc.createdAt).toLocaleString()}</span></div>
    </div>
  `;

  document.getElementById("accountInfo").innerHTML = html;
}

function applyInterestUI() {
  applyMonthlyInterest(currentAccount);
  renderAccountInfo();
}

function freezeUI() {
  manageAccountStatus(currentAccount, "FREEZE", "manager1");
  renderAccountInfo();
}

function unfreezeUI() {
  manageAccountStatus(currentAccount, "UNFREEZE");
  renderAccountInfo();
}

function showTransactionsUI() {
  const tx = getTransactions(currentAccount, {});
  alert(JSON.stringify(tx, null, 2));
}

function suspiciousCheckUI() {
  const result = checkForSuspiciousActivity(currentAccount);
  alert(JSON.stringify(result, null, 2));
}
