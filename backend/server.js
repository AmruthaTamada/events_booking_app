require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ ADD THIS
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();

app.use(cors()); // ✅ ADD THIS LINE
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});
