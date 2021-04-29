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

app.post("/users/:id/points/", async (req, res) => {
  const points = req.body;
  const userId = req.params.id;

  await db.collection("users").doc(userId).collection("points").add(points);
  res.status(201).json({ "message": "point added" });
});

app.put("/users/:id/points/:point_id", async (req, res) => {
  const body = req.body;
  const userId = req.params.id;
  const pointId = req.params.point_id;

  await db.collection("users").doc(userId).collection("points").doc(pointId).update(body);
  res.status(200).json({ "message": "point updated" });
});

app.delete("/users/:id/points/:point_id", async (req, res) => {
  const userId = req.params.id;
  const pointId = req.params.point_id;

  await db.collection("users").doc(userId).collection("points").doc(pointId).delete();
  res.status(204).send();
});

exports.user = functions.https.onRequest(app);