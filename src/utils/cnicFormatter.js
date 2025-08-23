// CNIC Formatter Utility
// Format: 41303-2343143224-4 (5 digits - 7 digits - 1 digit)

export const formatCNIC = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Limit to 13 digits
  const limitedValue = numericValue.slice(0, 13);
  
  // Apply formatting
  if (limitedValue.length <= 5) {
    return limitedValue;
  } else if (limitedValue.length <= 12) {
    return `${limitedValue.slice(0, 5)}-${limitedValue.slice(5)}`;
  } else {
    return `${limitedValue.slice(0, 5)}-${limitedValue.slice(5, 12)}-${limitedValue.slice(12)}`;
  }
};

export const validateCNIC = (value) => {
  // Remove formatting to check numeric length
  const numericValue = value.replace(/\D/g, '');
  return numericValue.length === 13;
};

export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

export const handleCNICInput = (e, setValue, fieldName) => {
  const formattedValue = formatCNIC(e.target.value);
  setValue(fieldName, formattedValue);
};
