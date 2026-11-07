export const calculateSplits = (type, amount, participants, customData) => {
  const totalAmount = parseFloat(amount);
  const splits = [];

  if (type === 'equal') {
    const share = +(totalAmount / participants.length).toFixed(2);
    let currentSum = 0;

    participants.forEach((userId, index) => {
      let userShare = share;
      // Adjust last person's share to eliminate rounding errors
      if (index === participants.length - 1) {
        userShare = +(totalAmount - currentSum).toFixed(2);
      }
      currentSum += share;
      splits.push({ user_id: userId, share_amount: userShare });
    });
  } else if (type === 'exact') {
    let sum = 0;
    for (const item of customData) {
      const share = parseFloat(item.amount);
      sum += share;
      splits.push({ user_id: item.user_id, share_amount: share });
    }
    if (Math.abs(sum - totalAmount) > 0.01) {
      throw new Error('Exact split amounts do not sum to total expense amount');
    }
  } else if (type === 'percentage') {
    let percentageSum = 0;
    customData.forEach((item) => {
      percentageSum += parseFloat(item.percentage);
    });

    if (Math.abs(percentageSum - 100) > 0.01) {
      throw new Error('Percentages must sum to 100%');
    }

    let currentSum = 0;
    customData.forEach((item, index) => {
      let share = +((totalAmount * parseFloat(item.percentage)) / 100).toFixed(2);
      if (index === customData.length - 1) {
        share = +(totalAmount - currentSum).toFixed(2);
      }
      currentSum += share;
      splits.push({ user_id: item.user_id, share_amount: share });
    });
  } else {
    throw new Error('Invalid split type');
  }

  return splits;
};