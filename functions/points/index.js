const functions = require("firebase-functions");
const firebaseApp = require("../db.js");
const express = require('express');
const cors = require('cors')({origin: true})
const app = express();

app.use(cors);

const db = firebaseApp.admin.firestore();

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

exports.point = functions.https.onRequest(app);