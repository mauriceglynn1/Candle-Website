import express from "express";
import db from "../db/connection.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const router = express.Router();
const USERS_COLLECTION = "users";

function sanitizeUser(doc) {
    const { passwordHash, ...safeFields } = doc;
    return safeFields;
}

router.get("/", async (req, res) => {
    try {
        const collection = db.collection(USERS_COLLECTION);
        const users = await collection
            .find({}, { projection: { passwordHash: 0 } })
            .toArray();

        res.status(200).json(users);
    } catch (err) {
        console.error("Failed to fetch users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        username,
        password,
        email,
        mailingAddress,
        role = "customer",
        cart = [],
        purchases = [],
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !username ||
        !password ||
        !email ||
        !mailingAddress
    ) {
        return res
            .status(400)
            .json({ error: "Missing required fields for signup" });
    }

    try {
        const collection = db.collection(USERS_COLLECTION);

        const duplicate = await collection.findOne({
            $or: [{ username }, { email }],
        });

        if (duplicate) {
            return res
                .status(409)
                .json({ error: "Username or email already in use" });
        }

        const passwordHash = hashPassword(password);
        const now = new Date();

        const newUser = {
            firstName,
            lastName,
            username,
            email,
            mailingAddress,
            role,
            cart: Array.isArray(cart) ? cart : [],
            purchases: Array.isArray(purchases) ? purchases : [],
            passwordHash,
            createdAt: now,
            updatedAt: now,
        };

        const result = await collection.insertOne(newUser);

        return res.status(201).json({
            message: "User created successfully",
            user: sanitizeUser({ ...newUser, _id: result.insertedId }),
        });
    } catch (err) {
        console.error("Failed to create user:", err);
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ error: "Username or email already in use" });
        }
        return res.status(500).json({ error: "Failed to create user" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    try {
        const collection = db.collection(USERS_COLLECTION);
        const user = await collection.findOne({ username });

        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const lastLoginAt = new Date();

        await collection.updateOne(
            { _id: user._id },
            { $set: { lastLoginAt } }
        );

        res.status(200).json({
            message: "Login successful",
            user: sanitizeUser({ ...user, lastLoginAt }),
        });
    } catch (err) {
        console.error("Failed to login user:", err);
        res.status(500).json({ error: "Failed to login" });
    }
});

export default router;
