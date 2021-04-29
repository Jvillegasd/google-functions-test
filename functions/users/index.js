const functions = require("firebase-functions");
const firebaseApp = require("../db.js");
const express = require('express');
const cors = require('cors')({origin: true})
const app = express();

app.use(cors);

const db = firebaseApp.admin.firestore();

app.post("/", async (req, res) => {
  const user = req.body;
  await db.collection("users").add(user);
  res.status(201).json({ "message": "user added" });
});

app.get("/", async (req, res) => {
  const snapshot = await db.collection("users").get();

  let users = [];
  snapshot.forEach(doc => {
    let id = doc.id;
    let data = doc.data();
    users.push({id, ...data});
  });

  res.status(200).json(JSON.stringify(users));
});

app.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await db.collection("users").doc(userId).get();

  res.status(200).json(JSON.stringify(user));
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