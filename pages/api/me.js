// pages/api/me.js
import { verifyToken } from '/lib/auth';

export default function handler(req, res) {
  try {
    const user = verifyToken(req);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
