// Import required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/usermodel.js');
const Transporter = require('./models/transportermodel.js');
const Shipment = require('./models/shipments.js');
const app = express();

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
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Routes main index
app.get('/', (req, res) => {
    res.render('index.ejs'); // Render the index.ejs page
});


// app.get('/user',function(req,res){
//      res.render('user-page.ejs')
// })



// Route to render the user page after login
app.get('/user-page/:userId', async (req, res) => {
    console.log('working')
    const userId = req.params.userId;
    console.log('User ID:', userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect('/login');
        }
        console.log('User found:', user);
        const shipments = await Shipment.find({ userId });
        console.log('Shipments:', shipments);

         console.log("page render by using /user")
        res.render('user-page.ejs', { user, shipments });  // user-page.ejs is the correct file name
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving data');
    }
});




// Transporter route
app.get('/transporter-page/:transporterId', async (req, res) => {
    const transporterId = req.params.transporterId; // Get transporterId from URL parameters

    try {
        const transporter = await Transporter.findById(transporterId); // Fetch transporter details
        if (!transporter) {
            return res.redirect('/login'); // Redirect to login if not found
        }

        res.render('transporter-page.ejs', { transporter }); // Render transporter page
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving transporter data');
    }
});

// Shipment initiation route
app.post('/shipments/initiate', async (req, res) => {
    const { userId, location, dateTime, goodsDescription, vehicleType } = req.body; // Retrieve details from the request body

    if (!userId || !location || !dateTime || !goodsDescription || !vehicleType) {
        return res.status(400).send('All fields are required!'); // Validate required fields
    }

    try {
        const newShipment = new Shipment({
            userId,
            location,
            dateTime,
            goodsDescription,
            vehicleType,
        });

        await newShipment.save(); // Save the shipment to the database
        console.log('Shipment initiated:', newShipment);
        res.redirect(`/user-page/${userId}`); // Redirect to the user page
    } catch (error) {
        console.error('Error initiating shipment:', error);
        res.status(500).send('Error initiating shipment');
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body; // Extract fields from request body

    if (!name || !email || !password || !role) {
        return res.status(400).send('All fields are required!');
    }

    try {
        if (role === 'user') {
            const newUser = new User({ name, email, password });
            const savedUser = await newUser.save();
            console.log('User signed up:', savedUser);
            res.status(201).redirect(`/use-page/${savedUser._id}`); // Redirect to user page
        } else if (role === 'transporter') {
            const newTransporter = new Transporter({ name, email, password });
            const savedTransporter = await newTransporter.save();
            console.log('Transporter signed up:', savedTransporter);
            res.status(201).redirect(`/transporter-page/${savedTransporter._id}`); // Redirect to transporter page
        } else {
            res.status(400).send('Invalid role selected');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password, role } = req.body; // Extract fields from request body

    if (!email || !password || !role) {
        return res.status(400).send('All fields are required!');
    }

    try {
        const model = role === 'user' ? User : Transporter; // Determine the model based on the role
        const user = await model.findOne({ email }); // Find the user by email

        if (user && user.password === password) {f
            console.log(`${role} logged in:`, user);
            res.redirect(role === 'user' ? `/user-page/${user.id}` : `/transporter-page/${user._id}`); // Redirect based on role
        } else {
            res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
