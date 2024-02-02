# TuGraduateProject

The main concept of the app is to assist users in locating the most economical store for purchasing groceries. Users have the option to search for individual products, and the app will provide a list of stores that sell the selected product along with their respective prices, facilitating price comparison.

Moreover, users can compile grocery lists comprising all the items they require, and the app will recommend the optimal store to procure those items from.

The app is structured around a microservice architecture. One microservice routinely scrapes online stores to collect pricing data, while another microservice stores this data and generates statistical insights such as inflation rates for different products over time, presented graphically. Additionally, there is a microservice integrated with AI that can identify fruits and vegetables from images. This functionality obviates the need for users to manually input the names of fruits and vegetables; they can simply take a picture of the desired item. Furthermore, when a user selects a physical store, the app provides information about the store's location.

In summary, the app will be accessible via both browser and mobile interfaces to accommodate user preferences.
