// Display -> Base Quantities
export const toBaseQuantity = (displayQuantity, displayUnit) => {
  const q = parseFloat(displayQuantity) || 0;
  switch (displayUnit) {
    case 'kg': return q * 1000;
    case 'L': return q * 1000;
    case 'g': return q;
    case 'mL': return q;
    case 'unit': return q;
    default: return q;
  }
};

// Display -> Base Pricing (e.g., price per kg -> price per g)
export const toBasePrice = (displayPrice, displayUnit) => {
  const p = parseFloat(displayPrice) || 0;
  switch (displayUnit) {
    case 'kg': return p / 1000;
    case 'L': return p / 1000;
    case 'g': return p;
    case 'mL': return p;
    case 'unit': return p;
    default: return p;
  }
};

// Map display unit to the strict DB base_unit enum
export const getBaseUnit = (displayUnit) => {
  if (['kg', 'g'].includes(displayUnit)) return 'g';
  if (['L', 'mL'].includes(displayUnit)) return 'mL';
  return 'unit';
};

// Display helper: formatting cost safely as currency
export const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
