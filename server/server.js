const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [
  { username: 'admin', password: '0101', role: 'admin' },
]; // initial admin user

let wallets = []; // { username, walletAddress }
let combatPowers = []; // { username, imageUrl, combatPower, timestamp }

// Helper to find user
function findUser(username) {
  return users.find(u => u.username === username);
}

// Login/Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) {
    return res.json({ success: false, message: 'User exists' });
  }
  users.push({ username, password, role: 'user' });
  res.json({ success: true, message: 'Registered' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (user && user.password === password) {
    res.json({ success: true, user: { username: user.username, role: user.role } });
  } else {
    res.json({ success: false });
  }
});

// Wallet API
app.get('/api/wallets', (req, res) => {
  res.json(wallets);
});
app.post('/api/wallets', (req, res) => {
  const { username, walletAddress } = req.body;
  // Only add if not exists
  if (!wallets.find(w => w.username === username && w.walletAddress === walletAddress)) {
    wallets.push({ username, walletAddress });
  }
  res.json({ success: true });
});
app.put('/api/wallets/:id', (req, res) => {
  const { id } = req.params;
  const { walletAddress } = req.body;
  if (wallets[id]) {
    wallets[id].walletAddress = walletAddress;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
app.delete('/api/wallets/:id', (req, res) => {
  const { id } = req.params;
  wallets.splice(id, 1);
  res.json({ success: true });
});

// Combat Power API
app.get('/api/combat', (req, res) => {
  res.json(combatPowers);
});
app.post('/api/combat', (req, res) => {
  const { username, imageUrl, combatPower } = req.body;
  combatPowers.push({ username, imageUrl, combatPower, timestamp: new Date() });
  res.json({ success: true });
});
app.delete('/api/combat/:id', (req, res) => {
  const { id } = req.params;
  combatPowers.splice(id, 1);
  res.json({ success: true });
});

// Server start
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
