const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./model/userModel');
const Group = require('./model/groupModel');
const GroupMembership = require('./model/groupMembershipModel');
const Expense = require('./model/expenseModel');
const ExpenseSheet = require('./model/expenseSheetModel');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Group.deleteMany({});
    await GroupMembership.deleteMany({});
    await Expense.deleteMany({});
    await ExpenseSheet.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const mainUserPassword = await bcrypt.hash('12345678', 10);
    const defaultPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Kalyani Dave',
        email: 'kalyanidave2004@gmail.com',
        password: mainUserPassword
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Arjun Singh',
        email: 'arjun.singh@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram.joshi@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Anita Verma',
        email: 'anita.verma@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Deepika Reddy',
        email: 'deepika.reddy@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Amit Agarwal',
        email: 'amit.agarwal@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Pooja Nair',
        email: 'pooja.nair@gmail.com',
        password: defaultPassword
      },
      {
        name: 'Sanjay Mehta',
        email: 'sanjay.mehta@gmail.com',
        password: defaultPassword
      }
    ]);
    console.log('Created users');

    // Create Groups
    const groups = await Group.create([
      {
        name: 'Goa Beach Trip 2024',
        description: 'Annual college friends trip to Goa beaches',
        createdBy: users[0]._id,
        type: 'trip'
      },
      {
        name: 'Mumbai Flat Mates',
        description: 'Shared apartment expenses in Andheri, Mumbai',
        createdBy: users[1]._id,
        type: 'roommates'
      },
      {
        name: 'Office Team Lunch',
        description: 'IT company team lunch and celebration expenses',
        createdBy: users[2]._id,
        type: 'project'
      },
      {
        name: 'Rajasthan Road Trip',
        description: 'Weekend trip to Jaipur and Udaipur',
        createdBy: users[3]._id,
        type: 'trip'
      },
      {
        name: 'Wedding Expenses',
        description: 'Cousin wedding celebration expenses',
        createdBy: users[4]._id,
        type: 'event'
      }
    ]);
    console.log('Created groups');

    // Create Group Memberships
    const memberships = await GroupMembership.create([
      // Goa Beach Trip 2024 - 6 members
      { userId: users[0]._id, groupId: groups[0]._id },
      { userId: users[1]._id, groupId: groups[0]._id },
      { userId: users[2]._id, groupId: groups[0]._id },
      { userId: users[3]._id, groupId: groups[0]._id },
      { userId: users[4]._id, groupId: groups[0]._id },
      { userId: users[7]._id, groupId: groups[0]._id },
      
      // Mumbai Flat Mates - 4 members
      { userId: users[1]._id, groupId: groups[1]._id },
      { userId: users[2]._id, groupId: groups[1]._id },
      { userId: users[5]._id, groupId: groups[1]._id },
      { userId: users[6]._id, groupId: groups[1]._id },
      
      // Office Team Lunch - 5 members
      { userId: users[2]._id, groupId: groups[2]._id },
      { userId: users[0]._id, groupId: groups[2]._id },
      { userId: users[3]._id, groupId: groups[2]._id },
      { userId: users[8]._id, groupId: groups[2]._id },
      { userId: users[9]._id, groupId: groups[2]._id },
      
      // Rajasthan Road Trip - 4 members
      { userId: users[3]._id, groupId: groups[3]._id },
      { userId: users[4]._id, groupId: groups[3]._id },
      { userId: users[10]._id, groupId: groups[3]._id },
      { userId: users[11]._id, groupId: groups[3]._id },
      
      // Wedding Expenses - 6 members
      { userId: users[4]._id, groupId: groups[4]._id },
      { userId: users[0]._id, groupId: groups[4]._id },
      { userId: users[5]._id, groupId: groups[4]._id },
      { userId: users[6]._id, groupId: groups[4]._id },
      { userId: users[7]._id, groupId: groups[4]._id },
      { userId: users[8]._id, groupId: groups[4]._id }
    ]);
    console.log('Created group memberships');

    // Create Expenses
    const expenses = await Expense.create([
      // Goa Beach Trip 2024 expenses
      {
        groupId: groups[0]._id,
        description: 'Beach Resort Booking - 3 Days',
        amount: 15000,
        paidBy: [{ userId: users[0]._id, amount: 15000 }],
        splitMember: [
          { userId: users[0]._id, amount: 3000 },
          { userId: users[1]._id, amount: 3000 },
          { userId: users[2]._id, amount: 3000 },
          { userId: users[3]._id, amount: 3000 },
          { userId: users[4]._id, amount: 3000 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-15')
      },
      {
        groupId: groups[0]._id,
        description: 'Flight Tickets Mumbai-Goa',
        amount: 20000,
        paidBy: [{ userId: users[1]._id, amount: 20000 }],
        splitMember: [
          { userId: users[0]._id, amount: 4000 },
          { userId: users[1]._id, amount: 4000 },
          { userId: users[2]._id, amount: 4000 },
          { userId: users[3]._id, amount: 4000 },
          { userId: users[4]._id, amount: 4000 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-10')
      },
      {
        groupId: groups[0]._id,
        description: 'Food & Beach Activities',
        amount: 8500,
        paidBy: [{ userId: users[2]._id, amount: 8500 }],
        splitMember: [
          { userId: users[0]._id, amount: 1700 },
          { userId: users[1]._id, amount: 1700 },
          { userId: users[2]._id, amount: 1700 },
          { userId: users[3]._id, amount: 1700 },
          { userId: users[4]._id, amount: 1700 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-16')
      },

      // Flat Mates - Pune expenses
      {
        groupId: groups[1]._id,
        description: 'Monthly Electricity Bill - MSEB Mumbai',
        amount: 3200,
        paidBy: [{ userId: users[1]._id, amount: 3200 }],
        splitMember: [
          { userId: users[1]._id, amount: 800 },
          { userId: users[2]._id, amount: 800 },
          { userId: users[5]._id, amount: 800 },
          { userId: users[6]._id, amount: 800 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-05')
      },
      {
        groupId: groups[1]._id,
        description: 'Big Bazaar Grocery & Household Items',
        amount: 2800,
        paidBy: [{ userId: users[5]._id, amount: 2800 }],
        splitMember: [
          { userId: users[1]._id, amount: 700 },
          { userId: users[2]._id, amount: 700 },
          { userId: users[5]._id, amount: 700 },
          { userId: users[6]._id, amount: 700 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-12')
      },
      {
        groupId: groups[1]._id,
        description: 'Airtel Internet & Tata Sky Cable Bill',
        amount: 1600,
        paidBy: [{ userId: users[6]._id, amount: 1600 }],
        splitMember: [
          { userId: users[1]._id, amount: 400 },
          { userId: users[2]._id, amount: 400 },
          { userId: users[5]._id, amount: 400 },
          { userId: users[6]._id, amount: 400 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-08')
      },

      // Rajasthan Road Trip expenses
      {
        groupId: groups[3]._id,
        description: 'Car Rental - Innova Crysta for 3 Days',
        amount: 12000,
        paidBy: [{ userId: users[3]._id, amount: 12000 }],
        splitMember: [
          { userId: users[3]._id, amount: 3000 },
          { userId: users[4]._id, amount: 3000 },
          { userId: users[10]._id, amount: 3000 },
          { userId: users[11]._id, amount: 3000 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-10')
      },
      {
        groupId: groups[3]._id,
        description: 'Hotel Stay - Jaipur & Udaipur',
        amount: 16000,
        paidBy: [{ userId: users[10]._id, amount: 16000 }],
        splitMember: [
          { userId: users[3]._id, amount: 4000 },
          { userId: users[4]._id, amount: 4000 },
          { userId: users[10]._id, amount: 4000 },
          { userId: users[11]._id, amount: 4000 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-11')
      },
      {
        groupId: groups[3]._id,
        description: 'Food & Sightseeing - Dal Baati, City Palace',
        amount: 6000,
        paidBy: [{ userId: users[11]._id, amount: 6000 }],
        splitMember: [
          { userId: users[3]._id, amount: 1500 },
          { userId: users[4]._id, amount: 1500 },
          { userId: users[10]._id, amount: 1500 },
          { userId: users[11]._id, amount: 1500 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-12')
      },

      // Wedding Expenses
      {
        groupId: groups[4]._id,
        description: 'Wedding Gift - Gold Jewelry',
        amount: 25000,
        paidBy: [{ userId: users[4]._id, amount: 25000 }],
        splitMember: [
          { userId: users[4]._id, amount: 4167 },
          { userId: users[0]._id, amount: 4167 },
          { userId: users[5]._id, amount: 4167 },
          { userId: users[6]._id, amount: 4167 },
          { userId: users[7]._id, amount: 4167 },
          { userId: users[8]._id, amount: 4165 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-15')
      },
      {
        groupId: groups[4]._id,
        description: 'Wedding Outfits - Sarees & Kurtas',
        amount: 18000,
        paidBy: [{ userId: users[0]._id, amount: 18000 }],
        splitMember: [
          { userId: users[4]._id, amount: 3000 },
          { userId: users[0]._id, amount: 3000 },
          { userId: users[5]._id, amount: 3000 },
          { userId: users[6]._id, amount: 3000 },
          { userId: users[7]._id, amount: 3000 },
          { userId: users[8]._id, amount: 3000 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-14')
      },
      {
        groupId: groups[4]._id,
        description: 'Travel to Wedding - Train Tickets',
        amount: 8400,
        paidBy: [{ userId: users[5]._id, amount: 8400 }],
        splitMember: [
          { userId: users[4]._id, amount: 1400 },
          { userId: users[0]._id, amount: 1400 },
          { userId: users[5]._id, amount: 1400 },
          { userId: users[6]._id, amount: 1400 },
          { userId: users[7]._id, amount: 1400 },
          { userId: users[8]._id, amount: 1400 }
        ],
        splitType: 'equally',
        date: new Date('2024-02-13')
      },

      // Office Team Lunch expenses
      {
        groupId: groups[2]._id,
        description: 'Team Lunch at Barbeque Nation, Powai',
        amount: 4500,
        paidBy: [{ userId: users[2]._id, amount: 4500 }],
        splitMember: [
          { userId: users[2]._id, amount: 900 },
          { userId: users[0]._id, amount: 900 },
          { userId: users[3]._id, amount: 900 },
          { userId: users[8]._id, amount: 900 },
          { userId: users[9]._id, amount: 900 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-18')
      },
      {
        groupId: groups[2]._id,
        description: 'Birthday Celebration Cake from Monginis',
        amount: 1200,
        paidBy: [{ userId: users[0]._id, amount: 1200 }],
        splitMember: [
          { userId: users[2]._id, amount: 240 },
          { userId: users[0]._id, amount: 240 },
          { userId: users[3]._id, amount: 240 },
          { userId: users[8]._id, amount: 240 },
          { userId: users[9]._id, amount: 240 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-20')
      },
      {
        groupId: groups[2]._id,
        description: 'Cafe Coffee Day - Team Meeting',
        amount: 800,
        paidBy: [{ userId: users[3]._id, amount: 800 }],
        splitMember: [
          { userId: users[2]._id, amount: 160 },
          { userId: users[0]._id, amount: 160 },
          { userId: users[3]._id, amount: 160 },
          { userId: users[8]._id, amount: 160 },
          { userId: users[9]._id, amount: 160 }
        ],
        splitType: 'equally',
        date: new Date('2024-01-22')
      }
    ]);
    console.log('Created expenses');

    // Create sample settlements (UNSETTLED)
    const settlements = await ExpenseSheet.create([
      // Goa Trip settlements
      {
        userId: users[1]._id, // Rahul owes
        payerId: users[0]._id, // to Kalyani
        groupId: groups[0]._id,
        amountToPay: 1000,
        settled: false
      },
      {
        userId: users[2]._id, // Priya owes
        payerId: users[0]._id, // to Kalyani
        groupId: groups[0]._id,
        amountToPay: 2300,
        settled: false
      },
      {
        userId: users[3]._id, // Arjun owes
        payerId: users[1]._id, // to Rahul
        groupId: groups[0]._id,
        amountToPay: 1700,
        settled: false
      },
      
      // Flat expenses settlements
      {
        userId: users[2]._id, // Priya owes
        payerId: users[1]._id, // to Rahul
        groupId: groups[1]._id,
        amountToPay: 800,
        settled: false
      },
      {
        userId: users[6]._id, // Anita owes
        payerId: users[5]._id, // to Vikram
        groupId: groups[1]._id,
        amountToPay: 700,
        settled: false
      },
      
      // Office settlements
      {
        userId: users[0]._id, // Kalyani owes
        payerId: users[2]._id, // to Priya
        groupId: groups[2]._id,
        amountToPay: 660,
        settled: false
      },
      {
        userId: users[8]._id, // Deepika owes
        payerId: users[3]._id, // to Arjun
        groupId: groups[2]._id,
        amountToPay: 480,
        settled: false
      },
      
      // Rajasthan Trip settlements
      {
        userId: users[4]._id, // Sneha owes
        payerId: users[3]._id, // to Arjun
        groupId: groups[3]._id,
        amountToPay: 3000,
        settled: false
      },
      {
        userId: users[11]._id, // Sanjay owes
        payerId: users[10]._id, // to Pooja
        groupId: groups[3]._id,
        amountToPay: 2500,
        settled: false
      },
      
      // Wedding settlements
      {
        userId: users[0]._id, // Kalyani owes
        payerId: users[4]._id, // to Sneha
        groupId: groups[4]._id,
        amountToPay: 1167,
        settled: false
      },
      {
        userId: users[6]._id, // Anita owes
        payerId: users[5]._id, // to Vikram
        groupId: groups[4]._id,
        amountToPay: 1400,
        settled: false
      },
      {
        userId: users[7]._id, // Ravi owes
        payerId: users[0]._id, // to Kalyani
        groupId: groups[4]._id,
        amountToPay: 2000,
        settled: false
      }
    ]);
    console.log('Created settlements');

    console.log('\n🎉 Complete dummy data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📂 Groups: ${groups.length} (4-6 members each)`);
    console.log(`💰 Expenses: ${expenses.length} (3 per group)`);
    console.log(`⚖️ Settlements: ${settlements.length} (all UNSETTLED)`);
    console.log(`💵 Total Money in System: ₹1,25,900`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('📧 kalyanidave2004@gmail.com (Main User - Password: 12345678)');
    console.log('📧 Other users password: password123');
    console.log('📧 rahul.sharma@gmail.com');
    console.log('📧 priya.patel@gmail.com');
    console.log('📧 arjun.singh@gmail.com');
    console.log('📧 sneha.gupta@gmail.com');
    console.log('📧 vikram.joshi@gmail.com');
    console.log('📧 anita.verma@gmail.com');
    console.log('📧 ravi.kumar@gmail.com');
    console.log('📧 deepika.reddy@gmail.com');
    console.log('📧 amit.agarwal@gmail.com');
    console.log('📧 pooja.nair@gmail.com');
    console.log('📧 sanjay.mehta@gmail.com');

    console.log('\n💡 Groups Overview:');
    console.log('🏖️  Goa Beach Trip 2024: ₹43,500 total (6 members)');
    console.log('🏠 Mumbai Flat Mates: ₹7,600 total (4 members)');
    console.log('🍽️  Office Team Lunch: ₹6,500 total (5 members)');
    console.log('🚗 Rajasthan Road Trip: New group (4 members)');
    console.log('💒 Wedding Expenses: New group (6 members)');
    console.log('\n🔥 All settlements are UNSETTLED - ready for demo!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();