export const categories = [
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'cafes', label: 'Cafes', icon: '☕' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'pharmacies', label: 'Pharmacies', icon: '💊' },
  { id: 'clinics', label: 'Clinics', icon: '🏥' },
  { id: 'gyms', label: 'Gyms', icon: '🏋️' },
  { id: 'barbers', label: 'Barbers', icon: '✂️' },
  { id: 'supermarkets', label: 'Supermarkets', icon: '🛒' }
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const getCategory = (id: string) => categories.find((category) => category.id === id);
