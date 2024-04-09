const mongoose = require('mongoose');
const { User, Thought } = require('../models');


const seed = async () => {
    try {
      await User.deleteMany({});
      await Thought.deleteMany({});
  
      const users = await User.insertMany(user);
  
     
      const modifiedThoughts = thoughts.map(thought => {
        return {
          ...thought,
          username: users[index].username
        };
      });
  
      await Thought.insertMany(modifiedThoughts);
  
      console.log('Database seeded successfully');
      process.exit(0);
    } catch (err) {
      console.error('Error seeding database:', err);
      process.exit(1);
    }
  };

seed();
console.info('Seeding complete! 🌱');
