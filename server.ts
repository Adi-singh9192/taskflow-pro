import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import { authRoutes } from "./server/routes/auth.js";
import { boardRoutes } from "./server/routes/boards.js";
import { taskRoutes } from "./server/routes/tasks.js";
import { aiRoutes } from "./server/routes/ai.js";
import { rewardRoutes } from "./server/routes/rewards.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    // Find matched express route
    let matchedRoute = "None (404 Not Found)";
    if (req.route) {
      matchedRoute = `${req.baseUrl || ""}${req.route.path}`;
    } else {
      // In Express, route resolution happens downstream, but we can inspect req.route or route stacks
      // If we don't have req.route, let's look for match manually or let it say None.
    }
    
    console.log(`\n=================== REQUEST LOG ===================`);
    console.log(`Requested URL: ${req.originalUrl || req.url}`);
    console.log(`HTTP Method: ${req.method}`);
    console.log(`Request Body: ${JSON.stringify(req.body, null, 2)}`);
    console.log(`Matched Express Route: ${matchedRoute}`);
    console.log(`MongoDB Connection Status: ${dbStatus}`);
    console.log(`Response Status: ${res.statusCode}`);
    
    if (res.statusCode === 404) {
      console.log(`[404 EXPLANATION]: The request path "${req.originalUrl || req.url}" did not match any registered routes.`);
      console.log(`Root prefixes registered: /api/auth, /api/boards, /api/tasks, /api/ai, /api/rewards.`);
      console.log(`Check for duplicated /api prefixes (e.g. /api/api/auth/login) or typos in the client.`);
    }
    console.log(`====================================================\n`);
  });
  
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/rewards", rewardRoutes);

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ status: "ok", database: dbStatus });
});

function printRoutes(app: any) {
  console.log("\n--- REGISTERED EXPRESS ROUTES ---");
  const routes: { method: string; path: string }[] = [];

  function traverse(pathParts: string[], layer: any) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      methods.forEach(method => {
        routes.push({
          method,
          path: "/" + pathParts.concat(layer.route.path.split("/")).filter(Boolean).join("/")
        });
      });
    } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
      let routerPath = "";
      if (layer.regexp) {
        const regexStr = layer.regexp.toString();
        const match = regexStr.match(/^\/\^\\\/([a-zA-Z0-9_\-\\\/]+)/);
        if (match) {
          routerPath = match[1].replace(/\\/g, "");
        }
      }
      layer.handle.stack.forEach((subLayer: any) => {
        traverse(pathParts.concat(routerPath.split("/").filter(Boolean)), subLayer);
      });
    }
  }

  if (app._router && app._router.stack) {
    app._router.stack.forEach((layer: any) => {
      traverse([], layer);
    });
  }

  const uniqueRoutes = Array.from(new Set(routes.map(r => `${r.method} ${r.path}`)));
  uniqueRoutes.forEach(route => console.log(route));
  console.log("---------------------------------\n");
}

async function startServer() {
  // Connect to DB if URI is present
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  } else {
    console.warn("MONGODB_URI is not set. Database features will be unavailable.");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Print all registered routes
  printRoutes(app);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
