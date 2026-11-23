const express = require('express');
const path = require('path');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());                                   // parse JSON bodies
app.use(express.static(path.join(__dirname, 'public')));   // serve frontend

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ComponentHub server is running', time: new Date().toISOString() });
});
app.use('/api/requests', requestRoutes);

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API route not found.' }));

// Malformed JSON and other errors (error-handling middleware)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body.' });
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`ComponentHub running on http://localhost:${PORT}`));
}
module.exports = app;
