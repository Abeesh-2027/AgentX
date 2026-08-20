import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
export function validateCredentials(username, password) {
  const cleanUser = String(username || "").trim();
  const cleanPass = String(password || "").trim();

  if (cleanUser.length < 2) {
    return { ok: false, error: "Username needs at least 2 characters." };
  }
  if (!/^\d{5}$/.test(cleanPass)) {
    return { ok: false, error: "Password must be exactly 5 digits." };
  }
  return { ok: true, username: cleanUser };
}

export function issueToken(username) {
  return jwt.sign({ sub: username }, SECRET, { expiresIn: "12h" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing session token." });
  }
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}
