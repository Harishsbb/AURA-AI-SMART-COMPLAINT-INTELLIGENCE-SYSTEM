const mongoose = require('mongoose');
const dns = require('dns');

// Fix for ECONNREFUSED with MongoDB Atlas DNS resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await User.deleteMany({ email: 'admin@aura.ai' });
        
        const adminUser = await User.create({
            name: 'Aura Administrator',
            email: 'admin@aura.ai',
            password: 'admin123',
            isAdmin: true
        });

        console.log('✅ Admin user seeded successfully');
        console.log('Email: admin@aura.ai');
        console.log('Password: admin123');
        
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
