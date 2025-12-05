/**
 * parsingService.js
 * Robust parser for transcripts.
 *
 * - Calls OpenAI to extract JSON fields.
 * - If OpenAI returns non-JSON text, try to extract JSON block.
 * - If JSON parsing still fails, fallback to simple heuristics:
 *     - priority: regex mapping (high/medium/low/critical)
 *     - dueDate: chrono-node parse on transcript
 *
 * Paste this file and restart your backend (nodemon will auto-restart).
 */

const OpenAI = require("openai");
const chrono = require("chrono-node");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// helper: map priority words to normalized values
function mapPriority(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/(critical|urgent)/.test(t)) return "Critical";
  if (/(high priority|high)/.test(t)) return "High";
  if (/(medium priority|medium|normal|moderate)/.test(t)) return "Medium";
  if (/(low priority|low|minor)/.test(t)) return "Low";
  return null;
}

// helper: convert a date-text (like "next Friday morning") to ISO using chrono
function convertDueDate(dueText) {
  if (!dueText) return null;
  const results = chrono.parse(dueText, new Date());
  if (!results.length) return null;
  let date = results[0].start.date();

  // smart default times if model didn't include time
  if (/morning/i.test(dueText) && !results[0].start.isCertain("hour")) date.setHours(9, 0, 0, 0);
  if (/afternoon/i.test(dueText) && !results[0].start.isCertain("hour")) date.setHours(14, 0, 0, 0);
  if (/evening/i.test(dueText) && !results[0].start.isCertain("hour")) date.setHours(18, 0, 0, 0);

  return date.toISOString();
}

// heuristic fallback: if LLM fails, try to find priority and due date from transcript
function heuristicParse(transcript) {
  const priority = mapPriority(transcript);
  // try chrono on full transcript
  const chronoResults = chrono.parse(transcript, new Date());
  let dueDate = null;
  let due_date_text = null;
  if (chronoResults.length) {
    due_date_text = chronoResults[0].text;
    dueDate = convertDueDate(due_date_text);
  }
  // For title fallback, remove common lead words
  const titleFallback = transcript
    .replace(/^(remind me to|remind me|create (a|an)?|please|add task to)/i, "")
    .replace(/(by|before|due|tomorrow|next|in \d+ days|this|on)\b.*/i, "")
    .trim();

  return {
    title: titleFallback || transcript.slice(0, 80),
    description: "",
    priority,
    status: "To Do",
    dueDate,
    due_date_text
  };
}

async function parseTranscript(transcript) {
  // safety: return quick heuristic if transcript empty
  if (!transcript || !transcript.trim()) {
    return { transcript, parsed: heuristicParse(transcript || "") };
  }

  // Strong instruction to return only JSON. But we also handle when model adds text.
  const prompt = `
You are a JSON extractor. Given a single user sentence that describes a task, return a JSON object only.
Do NOT add any extra text or explanation. The JSON keys must be:
title, description, priority, status, due_date_text

- title: short task title (remove prefixes like "remind me to")
- description: optional, extra details or empty string
- priority: one of "Low", "Medium", "High", "Critical" or empty string
- status: one of "To Do", "In Progress", "Done" (default To Do)
- due_date_text: the raw part of the sentence that describes the due date (like "next Friday morning", or "tomorrow evening"), or empty string if none

User sentence:
"${transcript}"

Return JSON only, for example:
{"title":"Send project proposal","description":"Include pricing appendix","priority":"High","status":"To Do","due_date_text":"next Friday morning"}
`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const rawText = resp.choices && resp.choices[0] && resp.choices[0].message
      ? resp.choices[0].message.content
      : (resp.choices && resp.choices[0] && resp.choices[0].text) || "";

    // try direct JSON.parse first
    let parsedJson = null;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (e) {
      // If direct parse fails, try to extract a JSON block from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedJson = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          // will fallback below
          parsedJson = null;
        }
      } else {
        parsedJson = null;
      }
    }

    // If we got parsedJson, normalize and convert date
    if (parsedJson) {
      // normalize fields
      const title = (parsedJson.title && parsedJson.title.trim()) || transcript.slice(0, 80);
      const description = parsedJson.description || "";
      const priority = (parsedJson.priority && parsedJson.priority.trim()) || null;
      const status = parsedJson.status || "To Do";
      const due_date_text = parsedJson.due_date_text || null;
      const dueDate = convertDueDate(due_date_text) || null;

      return {
        transcript,
        parsed: {
          title,
          description,
          priority,
          status,
          dueDate,
          due_date_text
        }
      };
    }

    // If no valid JSON from model, fallback to heuristic parse
    return { transcript, parsed: heuristicParse(transcript) };

  } catch (err) {
    console.error("Error calling OpenAI or parsing response:", err);
    // On any error, fallback to heuristics so UI still works
    return { transcript, parsed: heuristicParse(transcript) };
  }
}

module.exports = { parseTranscript };
