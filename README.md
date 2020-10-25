# eze-wholesale-backend

This is a simple backend application that pulls data from excel sheets, saves to mongoDB and fetches from DB using different queries.

**Author:** Michael Agboola

**Environments**

Node version - v12.18.3 (LTS)

YARN version - v1.22.10

**This application uses the following technologies:**

- nodeJs
- expressJs
- mongoose

**Install all dependencies**

```
yarn install
```

**Start the application**

```
yarn start
```


## SAVE PRODUCTS -

**Endpoint** `https://eze-backend-app.herokuapp.com/products` - method (POST)

- Saves products from an excel sheet

**Payload**

```
File with .xlsl extension is uploaded in the format below
```
![Image of excel format](https://drexlar5.github.io/images/excel-format.png)

### multipart/form-data

**Response format**

```json
{
  "error": false,
  "message": "Products succesfully saved"
}
```

### application/json

## FETCH PRODUCTS -

**Endpoint** `https://eze-backend-app.herokuapp.com/products?category=buyRequests&page=$1&perPage=${limit}&query=${query}&min=${min}&max=${max}` - method (GET)

- Fetches products from the database based on the query passed

**Response format**
```json
{
    "error": false,
    "message": "Products succesfully fetched",
    "data": {
        "currentPage": 1,
        "pages": 31,
        "totalData": 304,
        "paginatedData": [
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "new",
                "price": 560
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "a1",
                "price": 555
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "a2",
                "price": 550
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "a1",
                "price": 545
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "a2",
                "price": 540
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "c",
                "price": 535
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "c/b",
                "price": 530
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "64gb",
                "condition": "c/d",
                "price": 525
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "256gb",
                "condition": "new",
                "price": 580
            },
            {
                "deviceName": "iphone xs max",
                "storageSize": "256gb",
                "condition": "a1",
                "price": 575
            }
        ]
    }
}
```
### application/json

## ================ Side Note ================

Apart from the **category** and **page** the rest are optional but must be passed with empty string or null.


## The Design Principles used are:
 - Single Responsibility Principle
 - Dependency Inversion Principle
 - DRY Principle
 - KISS Principle
 - YAGNI Principle

### Single Responsibility Principle:
```
I utilized this principle since it makes my code simpler to actualize and forestalls unforeseen side-effects of future changes (when I roll out an improvement in one class or capacity it will be reflected on all the various classes or capacities that relies upon it).
```

### Dependency Inversion Principle:
```
I utilized this principle since I need my 'top-level' objects to be entirely stable and not delicate for change.
```

### DRY Principle:
```
I utilized this principle to make my code more composed and simpler to keep up. And furthermore spare my time at whatever point I need to change something later on. 
```

### KISS Principle:
```
I utilized this principle to make it simpler for other software engineers to envision the different parts of the applications, intellectually planning the potential impacts of any change.
```

### YAGNI Principle:
```
I utilized this principle since it abstains from investing energy on features that may not be used and helps me avoid feature creep.
```
