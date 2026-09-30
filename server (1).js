const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// 1. सिक्योर हेडर्स (Secure Headers)
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// 2. रेट लिमिट (Rate Limits)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'बहुत ज़्यादा रिक्वेस्ट भेजी गई हैं, कृपया बाद में प्रयास करें।' }
});
app.use('/api/', limiter);

// सैंपल डेटा एंडपॉइंट
app.get('/api/data', (req, res) => {
  res.json({ message: "बैकएंड से डेटा सफलतापूर्वक मिल गया है!" });
});

// 3. सर्वर-साइड वैलिडेशन (Server-side Validation)
app.post('/api/apply', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'नाम और ईमेल दोनों ज़रूरी हैं!' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'कृपया एक सही ईमेल एड्रेस डालें।' });
  }

  res.status(200).json({ success: true, message: 'आपका एप्लीकेशन सुरक्षित रूप से सबमिट हो गया है!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
