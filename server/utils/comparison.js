const parseComparison = (comparisonStr) => {
  const betweenRegex = /^(-?\d+(\.\d+)?)\s*-\s*(-?\d+(\.\d+)?)$/;
  const comparisonRegex = /^(<=|>=|<|>|=)?\s*(-?\d+(\.\d+)?)$/;

  // Check for between comparison first
  const betweenMatch = betweenRegex.exec(comparisonStr.trim());
  if (betweenMatch) {
    const lowerBound = parseFloat(betweenMatch[1]);
    const upperBound = parseFloat(betweenMatch[3]);
    return (input) => input >= lowerBound && input <= upperBound;
  }

  // Check for standard comparisons
  const match = comparisonRegex.exec(comparisonStr.trim());
  if (!match) {
    throw new Error(`Invalid comparison string: ${comparisonStr}`);
  }

  const operator = match[1] || "=";
  const value = parseFloat(match[2]);

  switch (operator) {
    case "<":
      return (input) => input < value;
    case "<=":
      return (input) => input <= value;
    case ">":
      return (input) => input > value;
    case ">=":
      return (input) => input >= value;
    case "=":
      return (input) => input === value;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
};

module.exports = parseComparison;
