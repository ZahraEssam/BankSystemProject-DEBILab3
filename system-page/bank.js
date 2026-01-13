let accountCounter = 1000000000;

// ==============================
// 1️⃣ Create New Bank Account
// ==============================
function createAccount(data) {

  if (!data.firstName || !data.lastName) {
    return "First name and last name are required";
  }

  if (!data.password) {
    return "Password is required";
  }

  // Validate password
  const validation = validatePassword(data.password);
  if (!validation.valid) {
    return "Password invalid: " + validation.reasons.join(", ");
  }

  if (data.initialDeposit < 50) {
    return "Initial deposit must be at least $50";
  }

  accountCounter++;

  return {
    accountNumber: accountCounter.toString(),
    firstName: data.firstName,
    lastName: data.lastName,
    password: data.password, 
    balance: data.initialDeposit,
    status: "ACTIVE",
    transactions: [],
    createdAt: new Date().toISOString()
  };
}


// ==============================
// 2️⃣ Deposit Money
// ==============================
function deposit(account, amount) {
  if (account.status === "FROZEN") {
    return "Account is frozen. Cannot deposit money.";
  }

  if (amount <= 0) return "Deposit amount must be positive";

  account.balance += amount;

  account.transactions.push({
    type: "DEPOSIT",
    amount,
    date: new Date().toISOString(),
    newBalance: account.balance
  });

  return account;
}


// ==============================
// 3️⃣ Withdraw Money
// ==============================
function withdraw(account, amount) {
  if (account.status === "FROZEN") {
    return "Account is frozen. Cannot withdraw money.";
  }

  if (amount <= 0) return "Invalid withdrawal amount";

  if (amount > account.balance) {
    account.balance -= 5;

    account.transactions.push({
      type: "OVERDRAFT_ATTEMPT",
      amount,
      penalty: 5,
      date: new Date().toISOString()
    });

    return "Insufficient funds";
  }

  account.balance -= amount;

  account.transactions.push({
    type: "WITHDRAWAL",
    amount,
    date: new Date().toISOString(),
    newBalance: account.balance
  });

  return account;
}

// ==============================
// 4️⃣ Transfer Between Accounts
// ==============================
function transfer(fromAccount, toAccount, amount) {
  if (fromAccount.status === "FROZEN") {
    return "Your account is frozen. Cannot transfer money.";
  }

  if (toAccount.status === "FROZEN") {
    return "Recipient account is frozen. Cannot receive transfer.";
  }

  if (amount <= 0) return "Invalid transfer amount";
  if (fromAccount.balance < amount) return "Insufficient funds";

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  fromAccount.transactions.push({
    type: "TRANSFER_OUT",
    to: toAccount.accountNumber,
    amount,
    date: new Date().toISOString()
  });

  toAccount.transactions.push({
    type: "TRANSFER_IN",
    from: fromAccount.accountNumber,
    amount,
    date: new Date().toISOString()
  });

  return true;
}

// ==============================
// 5️⃣ Monthly Interest
// ==============================
function applyMonthlyInterest(account) {
  if (account.type !== "SAVINGS" || account.balance <= 500) {
    return account;
  }

  const interest = account.balance * 0.00167;
  account.balance += interest;

  account.transactions.push({
    type: "INTEREST",
    amount: Number(interest.toFixed(2)),
    date: new Date().toISOString()
  });

  return account;
}

// ==============================
// 6️⃣ Get Transactions
// ==============================
function getTransactions(account, options) {
  let result = account.transactions;

  if (options?.startDate && options?.endDate) {
    result = result.filter(t => {
      const d = new Date(t.date);
      return d >= new Date(options.startDate) &&
             d <= new Date(options.endDate);
    });
  }

  if (options?.type) {
    result = result.filter(t => t.type === options.type);
  }

  return result;
}

// ==============================
// 7️⃣ Freeze / Unfreeze Account
// ==============================
function manageAccountStatus(account, action, managerId) {
  if (action === "FREEZE" && !managerId) {
    return "Manager approval required";
  }

  account.status = action === "FREEZE" ? "FROZEN" : "ACTIVE";

  account.statusHistory.push({
    action,
    by: managerId || "system",
    date: new Date().toISOString()
  });

  return account;
}

// ==============================
// 8️⃣ Daily Withdrawal Limit
// ==============================
function withdrawWithDailyLimit(account, amount) {
  if (account.status === "FROZEN") {
    return "Account is frozen. Cannot withdraw money.";
  }

  const DAILY_LIMIT = 500;
  const today = new Date().toISOString().split("T")[0];

  let totalToday = 0;

  account.transactions.forEach(t => {
    if (t.type === "WITHDRAWAL" && t.date.startsWith(today)) {
      totalToday += t.amount;
    }
  });

  if (totalToday + amount > DAILY_LIMIT) {
    return "Daily withdrawal limit exceeded ($500)";
  }

  return withdraw(account, amount);
}


// ==============================
// 9️⃣ Validate Password
// ==============================
function validatePassword(password) {
  let reasons = [];

  if (password.length < 12) reasons.push("Min 12 chars");
  if (!/[A-Z]/.test(password)) reasons.push("Uppercase required");
  if (!/[a-z]/.test(password)) reasons.push("Lowercase required");
  if (!/[0-9]/.test(password)) reasons.push("Number required");
  if (!/[!@#$%^&*]/.test(password)) reasons.push("Special char required");

  return reasons.length === 0
    ? { valid: true }
    : { valid: false, reasons };
}

// ==============================
// 🔟 Suspicious Activity
// ==============================
function checkForSuspiciousActivity(account) {
  let alerts = [];

  account.transactions.forEach(t => {
    if (t.amount > 10000) {
      alerts.push("High-value transaction detected");
    }
  });

  if (account.transactions.length >= 3) {
    alerts.push("Multiple rapid transactions");
  }

  return {
    isSuspicious: alerts.length > 0,
    alerts
  };
}