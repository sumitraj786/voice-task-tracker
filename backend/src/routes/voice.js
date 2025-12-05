const express = require('express');
const router = express.Router();
const { parseTranscript } = require('../services/parsingService');

router.post('/parse', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'transcript required' });
    const result = await parseTranscript(transcript);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'parsing failed' });
  }
});

module.exports = router;
