/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Define port and host
const PORT = 3000;
const HOST = "0.0.0.0";

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini client lazily to avoid startup crashes if key is missing
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not configured in environment secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Routes ---
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // App / Manifest security auditor using Gemini
  app.post("/api/audit", async (req, res) => {
    try {
      const { manifestText, appName } = req.body;
      if (!manifestText || manifestText.trim().length === 0) {
        return res.status(400).json({ error: "No manifest text or configuration provided for auditing." });
      }

      const ai = getGeminiClient();

      const prompt = `
        You are an expert mobile security and privacy auditor specializing in Android. 
        Your task is to analyze the following Android manifest, list of permissions, dependency records, or configurations for ${appName || 'Custom Application'}.
        Identify any privacy risks, background telemetry sync adapters, ad SDK receivers (like AppLovin, Unity Ads, Ironsource), location tracking liabilities, or excessive permissions.

        Analyze:
        """
        ${manifestText}
        """

        Provide your assessment strictly according to the requested JSON layout. Ensure the risk score is a number between 0 and 100 based on realistic risk rules.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional Android privacy and security auditor. You must output an absolute JSON object assessing the provided text. Keep summaries professional, straightforward, and compact.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: {
                type: Type.INTEGER,
                description: "Realistic calculated security risk score from 0 (perfect safety) to 100 (critical threat)."
              },
              summary: {
                type: Type.STRING,
                description: "A professional, user-focused 2-3 sentence summary of the security and privacy findings."
              },
              liabilities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the excessive permission, tracker SDK, or background process liability." },
                    level: { type: Type.STRING, description: "Threat severity level: 'Low', 'Medium', or 'High'." },
                    explanation: { type: Type.STRING, description: "Brief explanation of why this is a liability and what privacy index is compromised." }
                  },
                  required: ["name", "level", "explanation"]
                }
              },
              mitigations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of actionable steps or DNS block rules to neutralize these liabilities."
              },
              dnsHostnameSuggestion: {
                type: Type.STRING,
                description: "A suggested custom upstream blocklist hostname or private DNS endpoint (e.g. adguard, nextdns match) specific to this type of app."
              }
            },
            required: ["riskScore", "summary", "liabilities", "mitigations", "dnsHostnameSuggestion"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response returned from Gemini API.");
      }

      const auditResult = JSON.parse(responseText.trim());
      res.json(auditResult);

    } catch (error: any) {
      console.error("Express Gemini Audit Endpoint Error:", error);
      res.status(500).json({
        error: error.message || "Failed to complete security audit. Please ensure your Gemini API key is configured.",
        isConfigError: error.message?.includes("GEMINI_API_KEY")
      });
    }
  });

  // --- Vite & Production Static Handling ---
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express server for production static serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listen explicitly on PORT 3000 and 0.0.0.0
  app.listen(PORT, HOST, () => {
    console.log(`Express server running on http://${HOST}:${PORT}`);
  });
}

startServer();
