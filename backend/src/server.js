require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

// Request logging middleware (must be first)
app.use(requestLogger);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve frontend static files in production

app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Amazon Listing Optimizer API', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
