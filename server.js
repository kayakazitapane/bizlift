
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Permanent business storage file
const DATA_FILE = path.join(__dirname, 'businesses.json');

// Read businesses from the JSON file
function readBusinesses() {
    const fileData = JSON.parse(
        fs.readFileSync(DATA_FILE, 'utf8')
    );

    return fileData.businesses;
}

// Save businesses to the JSON file
function saveBusinesses(businesses) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({ businesses }, null, 2),
        'utf8'
    );
}

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to BizLift!');
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'BizLift API is running!'
    });
});

// Get all businesses
app.get('/api/businesses', (req, res) => {
    try {
        const businesses = readBusinesses();

        res.json({
            status: 'success',
            data: businesses
        });
    } catch (error) {
        console.error('Error reading businesses:', error);

        res.status(500).json({
            status: 'error',
            message: 'Could not load businesses.'
        });
    }
});

// Get one business by ID
app.get('/api/businesses/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const businesses = readBusinesses();

        const business = businesses.find(
            (business) => business.id === id
        );

        if (!business) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        res.json({
            status: 'success',
            data: business
        });
    } catch (error) {
        console.error('Error finding business:', error);

        res.status(500).json({
            status: 'error',
            message: 'Could not find business.'
        });
    }
});

// Add a new business
app.post('/api/businesses', (req, res) => {
    try {
        const { name, category, description } = req.body;

        if (
            typeof name !== 'string' || !name.trim() ||
            typeof category !== 'string' || !category.trim() ||
            typeof description !== 'string' || !description.trim()
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, category, and description are required'
            });
        }

        const businesses = readBusinesses();

        const newBusiness = {
            id: businesses.length
                ? Math.max(...businesses.map(
                    (business) => business.id
                )) + 1
                : 1,
            name: name.trim(),
            category: category.trim(),
            description: description.trim()
        };

        businesses.push(newBusiness);
        saveBusinesses(businesses);

        res.status(201).json({
            status: 'success',
            data: newBusiness
        });
    } catch (error) {
        console.error('Error saving business:', error);

        res.status(500).json({
            status: 'error',
            message: 'Could not save business.'
        });
    }
});

// Delete a business
app.delete('/api/businesses/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const businesses = readBusinesses();

        const index = businesses.findIndex(
            (business) => business.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        const deletedBusiness = businesses.splice(index, 1)[0];

        saveBusinesses(businesses);

        res.json({
            status: 'success',
            message: 'Business deleted successfully',
            data: deletedBusiness
        });
    } catch (error) {
        console.error('Error deleting business:', error);

        res.status(500).json({
            status: 'error',
            message: 'Could not delete business.'
        });
    }
});

// Update a business
app.put('/api/businesses/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        const businesses = readBusinesses();

        const business = businesses.find(
            (business) => business.id === id
        );

        if (!business) {
            return res.status(404).json({
                status: 'error',
                message: 'Business not found'
            });
        }

        const { name, category, description } = req.body;

        if (
            typeof name !== 'string' || !name.trim() ||
            typeof category !== 'string' || !category.trim() ||
            typeof description !== 'string' || !description.trim()
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, category, and description are required'
            });
        }

        business.name = name.trim();
        business.category = category.trim();
        business.description = description.trim();

        saveBusinesses(businesses);

        res.json({
            status: 'success',
            message: 'Business updated successfully',
            data: business
        });
    } catch (error) {
        console.error('Error updating business:', error);

        res.status(500).json({
            status: 'error',
            message: 'Could not update business.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(
        `BizLift server is running at http://localhost:${PORT}`
    );
});
