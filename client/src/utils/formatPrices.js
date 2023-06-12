const formatPrices = (products) => {
  return products.map((product) => {
    let [whole, fractional] = String(product.price).split(".");
    fractional = fractional.padEnd(2, 0);
    product.price = `${whole}.${fractional}`;
    return product;
  });
};

export default formatPrices;
