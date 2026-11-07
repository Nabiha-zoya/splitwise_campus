export const simplifyDebts = (netBalances) => {
  const debtors = [];
  const creditors = [];

  Object.entries(netBalances).forEach(([userId, balance]) => {
    const val = +balance.toFixed(2);
    if (val < -0.01) {
      debtors.push({ user_id: parseInt(userId), amount: -val });
    } else if (val > 0.01) {
      creditors.push({ user_id: parseInt(userId), amount: val });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const settleAmount = Math.min(debtors[i].amount, creditors[j].amount);

    transactions.push({
      from: debtors[i].user_id,
      to: creditors[j].user_id,
      amount: +settleAmount.toFixed(2)
    });

    debtors[i].amount -= settleAmount;
    creditors[j].amount -= settleAmount;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return transactions;
};