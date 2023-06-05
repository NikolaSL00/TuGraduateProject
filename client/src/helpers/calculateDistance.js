const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const findClosestCoordinates = (current, coords) => {
  let closestIndex = 0;
  let closestDistance = Number.MAX_VALUE;

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const distance = calculateDistance(
      current.latitude,
      current.longitude,
      coord.latitude,
      coord.longitude
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return coords[closestIndex];
};
