const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/usermodel.js');
const Transporter = require('./models/transportermodel.js');
const shipment = require('./models/shipments.js');
const app = express();
const cookieParser = require('cookie-parser');

// Add cookie-parser middleware
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/finaltss', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes main index
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs page
});

// Route to render the user page after login
app.get('/user', (req, res) => {
    // Retrieve userId from the cookies
    const userId = req.cookies.userId;

    if (!userId) {
        // If no userId in cookie, redirect to login page
        return res.redirect('/login');
    }

    // Find the user by userId
    User.findById(userId, (err, user) => {
        if (err) {
            // Handle error if there is an issue retrieving the user data
            return res.status(500).send('Error retrieving user data');
        }

        if (!user) {
            // If no user found with the given userId, redirect to login
            return res.redirect('/login');
        }

        // Find shipments associated with this userId
        Shipment.find({ userId: userId }, (err, shipments) => {
            if (err) {
                // Handle error if there is an issue retrieving shipments
                return res.status(500).send('Error retrieving shipments');
            }

            // Render the user page and pass the user and shipments data
            res.render('user-page', { user, shipments });
        });
    });
});


// transporter------>

app.get('/transporter', (req, res) => {
    res.render('transporter-page'); // Render the transporter page
});


 //shipment--->
// POST route for initiating a shipment
app.post('/shipments/initiate', async (req, res) => {
    const { location, dateTime, goodsDescription, vehicleType } = req.body;

    // Check if all fields are provided
    if (!location || !dateTime || !goodsDescription || !vehicleType) {
        return res.status(400).send('All fields are required!');
    }

    try {
        // Create a new shipment object
        const newShipment = new Shipment({
            location,
            dateTime,
            goodsDescription,
            vehicleType,
        });

        // Save the shipment to the database
        await newShipment.save();

        console.log('Shipment initiated:', newShipment);

        // Redirect the user to the dashboard or another page after the shipment is created
        res.redirect('/user'); // Redirect to user dashboard or another page as necessary
    } catch (error) {
        console.error('Error initiating shipment:', error);
        res.status(500).send('Error initiating shipment');
    }
});

// Signup Route
app.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).send('All fields are required!');
    }

    if (role === 'user') {
        const newUser = new User({ name, email, password });
        newUser.save((err, savedUser) => {
            if (err) {
                return res.status(500).send('Error during signup');
            }
            console.log('User signed up:', savedUser);
            return res.status(201).redirect('/user');
        });
    } else if (role === 'transporter') {
        const newTransporter = new Transporter({ name, email, password });
        newTransporter.save((err, savedTransporter) => {
            if (err) {
                return res.status(500).send('Error during signup');
            }
            console.log('Transporter signed up:', savedTransporter);
            return res.status(201).redirect('/transporter');
        });
    } else {
        return res.status(400).send('Invalid role selected');
    }
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).send('All fields are required!');
    }

    const model = role === 'user' ? User : Transporter;

    model.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).send('Error during login');
        }

        if (user && user.password === password) {
            console.log(`${role} logged in:`, user);
            return res.redirect(role === 'user' ? '/user' : '/transporter');
        }

        return res.status(400).send('Invalid email or password');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
