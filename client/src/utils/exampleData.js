const store1 = {
  name: "Ebag",
  locations: [],
  products: [],
};
const store2 = {
  name: "Bullmag",
  locations: [],
  products: [],
};

// Location objects
const location1 = {
  country: "Bulgaria",
  city: "Plovdiv",
  isPhysical: true,
  coordinates: {
    latitude: 43.2062504429181,
    longitude: 27.9118501905538,
  },
};

const location2 = {
  country: "Bulgaria",
  city: "Sofia",
  isPhysical: true,
  coordinates: {
    latitude: 43.21747603227359,
    longitude: 27.89851926560668,
  },
};

store1.locations.push(location1, location2);
store2.locations.push(location1, location2);

const product1 = {
  store: store1,
  title: "Червени ябълки",
  description: "Био",
  imageUrl: "https://www.ebag.bg/products/images/107728/200/webp",
  price: "3.89",
  unit: "за кг",
  productUrl:
    "https://www.ebag.bg/search/?query=%D1%8F%D0%B1%D1%8A%D0%BB%D0%BA%D0%B8&product=597351",
};

const product2 = {
  store: store1,
  title: "Ябълки Зелени Грени Смит",
  description: "Био",
  imageUrl: "https://www.ebag.bg/products/images/98101/200/webp",
  price: "3.49",
  unit: "за кг",
  productUrl:
    "https://www.ebag.bg/search/?query=%D1%8F%D0%B1%D1%8A%D0%BB%D0%BA%D0%B8&product=576292",
};
const product3 = {
  store: store1,
  title: "Ябълки Зелени",
  description: "Био",
  imageUrl: "https://www.ebag.bg/products/images/98101/200/webp",
  price: "3.30",
  unit: "за кг",
  productUrl:
    "https://www.ebag.bg/search/?query=%D1%8F%D0%B1%D1%8A%D0%BB%D0%BA%D0%B8&product=576292",
};

const product4 = {
  store: store1,
  title: "Лайм",
  description: "Био",
  imageUrl: "https://www.ebag.bg/products/images/31783/200/webp",
  price: "1.09",
  unit: "за кг",
  productUrl:
    "https://www.ebag.bg/search/?query=&hierarchicalMenu%5Bhierarchical_categories_bg.lv1%5D=%D0%9F%D0%BB%D0%BE%D0%B4%D0%BE%D0%B2%D0%B5+%D0%B8+%D0%B7%D0%B5%D0%BB%D0%B5%D0%BD%D1%87%D1%83%D1%86%D0%B8&page=1&configure%5BclickAnalytics%5D=true&product=13635",
};

const product5 = {
  store: store2,
  title: "Ябълки червени",
  description: "Био",
  imageUrl:
    "https://api.bulmag.org/thumbnails/ea6d03011d339dfd0d6415e07cb5b0a2.jpg",
  price: "3.70",
  unit: "за кг",
  productUrl: "https://bulmag.org/product/yabalka-chervena-ii",
};

const product6 = {
  store: store2,
  title: "Ябълки Зелени",
  description: "Био",
  imageUrl: "https://www.ebag.bg/products/images/98101/200/webp",
  price: "3.35",
  unit: "за кг",
  productUrl:
    "https://www.ebag.bg/search/?query=%D1%8F%D0%B1%D1%8A%D0%BB%D0%BA%D0%B8&product=576292",
};

const product7 = {
  store: store2,
  title: "Лайм",
  description: "Био",
  imageUrl:
    "https://api.bulmag.org/thumbnails/3eeccf6585e5a1714c7c9fe597d204c9.jpg",
  price: "1.49",
  unit: "за бр",
  productUrl: "https://bulmag.org/product/limon-laym-br",
};

const product8 = {
  store: store2,
  title: "Лайм",
  description: "Био",
  imageUrl:
    "https://api.bulmag.org/thumbnails/3eeccf6585e5a1714c7c9fe597d204c9.jpg",
  price: "1.59",
  unit: "за бр",
  productUrl: "https://bulmag.org/product/limon-laym-br",
};
store1.products.push(product1, product2, product3, product4);
store2.products.push(product6, product7, product8);

export const stores = [store1, store2];
export const products = [
  product1,
  product2,
  product3,
  product4,
  product6,
  product7,
  product8,
];
