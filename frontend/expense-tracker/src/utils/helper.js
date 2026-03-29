import moment from 'moment'
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num === null || num === undefined || num === "") return 0;

  if (isNaN(num)) return 0;

  const [integerPart, fractionalPart] = num.toString().split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = [] ) => {
  if (!Array.isArray(data)) return [];
  const chartData = data.map((item) => ({
    month: item?.month,
    category: item?.category,
    amount: item?.amount,
  }));
  return chartData;
};



export const prepareIncomeBarChartData = (data = []) => {
    if (!Array.isArray(data)) return [];
    
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    // ✅ group by date and sum amounts
    const groupedData = sortedData.reduce((acc, item) => {
        const category = moment(item?.date).format('Do MMM');
        if (acc[category]) {
            acc[category].amount += item?.amount;
        } else {
            acc[category] = { category, amount: item?.amount, source: item?.source };
        }
        return acc;
    }, {});

    return Object.values(groupedData);
};

export const prepareExpensearChartData = (data = []) => {
    if (!Array.isArray(data)) return [];
    
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    // ✅ group by date and sum amounts
    const groupedData = sortedData.reduce((acc, item) => {
        const month = moment(item?.date).format('Do MMM');
        if (acc[month]) {
            acc[month].amount += item?.amount;
        } else {
            acc[month] = { month, amount: item?.amount, category: item?.category };
        }
        return acc;
    }, {});

    return Object.values(groupedData);
};