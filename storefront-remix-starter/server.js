import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./build/index.js";

const app = express();

// Logging middleware
const loggingMiddleware = (req, res, next) => {
  // Log incoming request
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);

  // Capture the original response methods
  const originalJson = res.json;
  const originalSend = res.send;

  // Override response methods to log the response
  res.json = function (body) {
    console.log('Response Body:', body);
    return originalJson.call(this, body);
  };

  res.send = function (body) {
    console.log('Response Body:', body);
    return originalSend.call(this, body);
  };

  // Log response when it's finished
  res.on('finish', () => {
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Response Headers:', res.getHeaders());
  });

  next();
};

// Apply the logging middleware
app.use(loggingMiddleware);

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// This is your Remix server
app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});