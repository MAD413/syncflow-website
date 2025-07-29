const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-webhook', async (req, res) => {
  // *** החלף כאן את כתובת ה-Webhook שלך! ***
  const WEBHOOK_URL = 'https://mad.eseqtech.com/webhook-test/9e38e452-ba2c-4eb1-83bc-7b2dc339e983'; 

  const formData = req.body;
  console.log('Received form data:', formData);

  try {
    const data = JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message
    });
    
    const url = new URL(WEBHOOK_URL);

    const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = https.request(options, response => {
        console.log(`Webhook sent, statusCode: ${response.statusCode}`);
    });

    request.on('error', error => {
        console.error('Webhook Error:', error);
    });

    request.write(data);
    request.end();

    res.status(200).json({ message: 'Success!' });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});