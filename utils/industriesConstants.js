// frontend/constants/industries.js
export const INDUSTRIES = [
  { label: 'Technology', value: 'technology' },
  { label: 'Software', value: 'software' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'Retail', value: 'retail' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Travel', value: 'travel' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Education', value: 'education' },
  { label: 'Finance', value: 'finance' },
  { label: 'Real Estate', value: 'real_estate' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Media', value: 'media' },
  { label: 'Nonprofit', value: 'nonprofit' },
  { label: 'Professional Services', value: 'professional_services' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Construction', value: 'construction' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Energy', value: 'energy' },
  { label: 'Telecommunications', value: 'telecommunications' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Other', value: 'other' },
];

export const getIndustryLabel = (value) => {
  const industry = INDUSTRIES.find(i => i.value === value);
  return industry ? industry.label : value;
};

export const getIndustryValue = (label) => {
  const industry = INDUSTRIES.find(i => i.label === label);
  return industry ? industry.value : label.toLowerCase().replace(/\s+/g, '_');
};