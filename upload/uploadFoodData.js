const fs = require("fs");
const { Firestore } = require("@google-cloud/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const path = require("path");
const directoryPath = path.join(__dirname, "data");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    var lastDotIndex = file.lastIndexOf(".");
    var dataMakanan = require("./data/" + file);

    const foodIds = new Set(); // Objek Set untuk menyimpan food_id yang unik

    dataMakanan.forEach(function (foodData) {
      const foodName = Object.keys(foodData)[0];
      const foodCollection = db.collection("foods");

      const foodDocRef = foodCollection.doc(foodName);
      const foods = foodData[foodName].foods.food;

      if (Array.isArray(foods)) {
        foods.forEach(function (food) {
          if (!foodIds.has(food.food_id)) {
            // Memeriksa apakah food_id sudah ada dalam Set
            foodIds.add(food.food_id); // Menambahkan food_id ke Set

            const foodObj = {
              food_description: food.food_description,
              food_id: food.food_id,
              food_name: food.food_name,
              food_type: food.food_type,
              food_url: food.food_url,
            };

            foodDocRef
              .collection("food")
              .doc(food.food_id)
              .set(foodObj)
              .then(function () {
                console.log("Document written");
              })
              .catch(function (error) {
                console.error("Error adding document: ", error);
              });
          } else {
            console.error("Duplicate food_id found: " + food.food_id);
          }
        });
      } else {
        console.error("Invalid data format for foods in file: " + file);
      }
    });
  });
});
