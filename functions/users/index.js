const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const serviceAccount  = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use(cors({ origin: true }));

const db = admin.firestore();

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

app.put("/:id", async (req, res) => {
  const body = req.body;
  await db.collection("users").doc(req.params.id).update(body);
  res.status(200).json({ "message": "user updated" });
});

app.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();
  
  res.status(204).send();
});

exports.user = functions.https.onRequest(app);