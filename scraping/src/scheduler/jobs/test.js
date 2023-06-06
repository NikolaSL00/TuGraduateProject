const { parentPort } = require("worker_threads");

(async () => {
    let products = [
        {
          title: 'title1',
          description: 'description1',
          imageUrl: 'imageUrl1',
          price: '12.12',
          unit: 'kg',
          productUrl: 'productUrl1',
        },
        {
            title: 'title2',
            description: 'description2',
            imageUrl: 'imageUrl2',
            price: '13.13',
            unit: 'kg',
            productUrl: 'productUrl2',
          },
      ];

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
  }
  finally {
    await browser.close();
    process.exit(0);
}
})();
