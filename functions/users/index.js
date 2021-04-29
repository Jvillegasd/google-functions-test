const functions = require("firebase-functions");
const firebaseApp = require("../db.js");
const express = require('express');
const md5 = require("md5");
const cors = require('cors')({origin: true})
const app = express();

app.use(cors);

const db = firebaseApp.admin.firestore();

app.post("/", async (req, res) => {
  let user = req.body;
  user.password = md5(user.password);
  
  await db.collection("users").add(user);
  res.status(201).json({ "message": "user added" });
});

app.get("/", async (req, res) => {
  let users = [];
  const snapshot = await db.collection("users").get();
  
  for(const doc of snapshot.docs) {
    let id = doc.id;
    let data = doc.data();
    let points = [];

    let pointsCollection = await db.collection("users").doc(doc.id).collection("points").get();
    for(const subDoc of pointsCollection.docs) {
      points.push({ "id": subDoc.id, "data": subDoc.data() });
    }

    users.push({id, ...data, points});
  }

  res.status(200).json(users);
});

app.get("/:id", async (req, res) => {
  let points = [];
  const userId = req.params.id;
  const user = await db.collection("users").doc(userId).get();
  const data = user.data();

  let pointsCollection = await db.collection("users").doc(userId).collection("points").get();
  for(const subDoc of pointsCollection.docs) {
    points.push({ "id": subDoc.id, "data": subDoc.data() });
  }

  res.status(200).json({ "id": user.id,  ...data, points});
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  await db.collection("users").doc(userId).update(body);
  res.status(200).json({ "message": "user updated" });
});

app.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  await db.collection("users").doc(userId).delete();
  res.status(204).send();
});

exports.user = functions.https.onRequest(app);