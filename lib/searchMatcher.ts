type SearchMatchInput = {
  savedCity?: string | null;
  savedMinPrice?: number | null;
  savedMaxPrice?: number | null;
  savedBeds?: number | null;
  savedBaths?: number | null;

  propertyCity?: string | null;
  propertyPrice?: number | null;
  propertyBeds?: number | null;
  propertyBaths?: number | null;
};

export function doesPropertyMatchSavedSearch({
  savedCity,
  savedMinPrice,
  savedMaxPrice,
  savedBeds,
  savedBaths,
  propertyCity,
  propertyPrice,
  propertyBeds,
  propertyBaths,
}: SearchMatchInput) {
  if (
    savedCity &&
    propertyCity &&
    savedCity.toLowerCase() !== propertyCity.toLowerCase()
  ) {
    return false;
  }

  if (savedMinPrice && propertyPrice && propertyPrice < savedMinPrice) {
    return false;
  }

  if (savedMaxPrice && propertyPrice && propertyPrice > savedMaxPrice) {
    return false;
  }

  if (savedBeds && propertyBeds && propertyBeds < savedBeds) {
    return false;
  }

  if (savedBaths && propertyBaths && propertyBaths < savedBaths) {
    return false;
  }

  return true;
}