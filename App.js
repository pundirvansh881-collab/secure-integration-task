import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  // 1. लोड और रेंडर API डेटा
  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('सर्वर से कनेक्ट करने में विफल!');
        }
        return response.json();
      })
      .then((data) => {
        setData(data.message);
        setLoading(false);
      })
      .catch((err) => {
        setApiError(err.message);
        setLoading(false);
      });
  }, []);

  // 2. क्लाइंट-साइड वैलिडेशन और सबमिशन
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');

    if (!name || !email) {
      setFormError('कृपया सभी फ़ील्ड भरें।');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || 'कुछ गड़बड़ हुई!');
      } else {
        setFormMessage(result.message);
        setName('');
        setEmail('');
      }
    } catch (err) {
      setFormError('सर्वर से संपर्क नहीं हो पाया।');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Secure Application Integration</h1>

      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px' }}>
        <h3>API स्टेटस:</h3>
        {loading && <p style={{ color: 'blue' }}>🔄 डेटा लोड हो रहा है...</p>}
        {apiError && <p style={{ color: 'red' }}>❌ एरर: {apiError}</p>}
        {data && <p style={{ color: 'green' }}>✅ {data}</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <h3>एप्लीकेशन फॉर्म:</h3>
        <input 
          type="text" 
          placeholder="अपना नाम लिखें" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <input 
          type="email" 
          placeholder="अपना ईमेल लिखें" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: 'purple', color: 'white', border: 'none', cursor: 'pointer' }}>
          सबमिट करें
        </button>
      </form>

      {formError && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ {formError}</p>}
      {formMessage && <p style={{ color: 'green', marginTop: '10px' }}>🎉 {formMessage}</p>}
    </div>
  );
}

export default App;
