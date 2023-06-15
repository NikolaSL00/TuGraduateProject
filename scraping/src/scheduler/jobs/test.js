const { parentPort } = require("worker_threads");

(async () => {
  function getMemorySizeOfObject(obj) {
    const jsonString = JSON.stringify(obj);
    return new Blob([jsonString]).size;
  }

  const obj1 = {
    title: "title1",
    description: "description1",
    imageUrl: "imageUrl1",
    price: "12.12",
    unit: "kg",
    productUrl: "productUrl1",
  };

  const limit = 100_000;
  console.log(
    "Approximately memory size of 1 object: ",
    getMemorySizeOfObject(obj1)
  );
  let products = [];

  for (let i = 0; i <= limit; i++) {
    products.push({
      title: `title${i}`,
      description: `description${i}`,
      imageUrl: `imageUrl${i}`,
      price: "12.12",
      unit: "kg",
      productUrl: `productUrl${i}`,
    });
  }

  try {
    parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Varna",
          isPhysical: false,
        },
      ],
    });
  } catch (err) {
    parentPort.postMessage({ error: err });
  } finally {
    process.exit(0);
  }
})();
