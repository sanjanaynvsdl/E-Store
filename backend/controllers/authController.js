const admin = require('../utils/firebaseAdmin');
const jwt = require('jsonwebtoken');
const { User, ApprovedEmail, Rider } = require('../models/usersModel');

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const userSignIn = async (req, res) => {
    try {
        const idToken = req.headers.authorization?.split("Bearer ")[1];

        if (!idToken) return res.status(401).json({ 
            message: "No token provided"
         });

        const decoded = await admin.auth().verifyIdToken(idToken);
        const email = decoded.email;
        const name = decoded.name;

        const approved = await ApprovedEmail.findOne({ email });
        if (!approved) {
            return res.status(403).json({ message: "Email not approved" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                role: approved.role,
                address: {},
                phone: ""
            });
        }

        const token = createToken({ id: user._id, role: user.role });
        return res.status(200).json({
            message: "User login successful",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            token:token
        });

    } catch (err) {
        console.error("Internal server error in User SignIn : ", err);
        
        return res.status(500).json({ 
            message: "Internal Server Error",
            error:err.message,
        });
    }
};

const riderSignIn = async (req, res) => {
    try {
        const idToken = req.headers.authorization?.split("Bearer ")[1];
        if (!idToken) return res.status(401).json({ message: "No token provided" });

        const decoded = await admin.auth().verifyIdToken(idToken);
        const email = decoded.email;
        const name = decoded.name;

        let rider = await Rider.findOne({ email });
        if (!rider) {
            return res.status(403).json({ message: "Not a registered rider" });
        }

        const token = createToken({ id: rider._id, role: "rider" });
        return res.json({
            message: "Rider login successful",
            rider: {
                name: rider.name,
                email: rider.email
            },
            role:"rider",
            token:token
        });
    } catch (err) {

        console.error("Rider SignIn Error:", err);
        return res.status(500).json({ 
            message: "Internal Server Error",
            error:err.message,
         });
    }
};

module.exports = {
    userSignIn,
    riderSignIn
};
