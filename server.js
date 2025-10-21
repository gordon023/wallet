const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let logs = []; // In-memory logs, could be saved to file or DB

// Load logs from file if exists
const LOG_FILE = 'logs.json';
if (fs.existsSync(LOG_FILE)) {
  logs = JSON.parse(fs.readFileSync(LOG_FILE));
}

function addLog(entry) {
  logs.push({ timestamp: new Date(), entry });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs));
}

// Dummy user data
let users = [{ username: 'admin', password: '0101', role: 'admin', canEdit: false }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    addLog(`User ${username} logged in`);
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/register', (req, res) => {
  const { username, password } }= req.body;
  if (users.some(u => u.username === username)) {
    return res.json({ success: false, message: 'Username exists' });
  }
  users.push({ username, password, role: 'user', canEdit: false });
  addLog(`New user registered: ${username}`);
  res.json({ success: true });
});

// Example endpoints for logs
app.get('/logs', (req, res) => {
  res.json(logs);
});

// Serve static files (your frontend)
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
