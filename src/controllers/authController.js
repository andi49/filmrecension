
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {

  static async register(req, res) {
    try {
      const { email, password } = req.body || {};

   
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 255 ||
        typeof password !== "string" ||
        password.length < 8 ||
        Buffer.byteLength(password, "utf8") > 72
      ) {
        return res.status(400).json({
          error: "Ange giltig e-post och lösenord (minst 8 tecken)"
        });
      }

    
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findByEmail(normalizedEmail);

      if (existingUser) {
        return res.status(409).json({
          error: "E-postadressen används redan"
        });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const user = new User(normalizedEmail, passwordHash);
      const savedUser = await user.save();

      return res.status(201).json({
        message: "Användare skapad!",
        user: savedUser
      });

    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "E-postadressen används redan"
        });
      }

      console.error("Register error:", error);

      return res.status(500).json({
        error: "Något gick fel på servern"
      });
    }
  }


static async login(req, res) {
  try {
    const { email, password } = req.body || {};


    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255 ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        error: "Ange giltig e-post och lösenord"
      });
    }


    const user = await User.findByEmail(
      email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        error: "Fel e-post eller lösenord"
      });
    }


    const validPassword = await bcrypt.compare(password,user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        error: "Fel e-post eller lösenord"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Inloggning lyckades!",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Något gick fel på servern"
    });
  }
}

}




module.exports = AuthController;
