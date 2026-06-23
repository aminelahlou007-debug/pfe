export const defaultGuests = [
    { name: "Sarah Miller", email: "sarah@email.com", phone: "(555) 123-4567", ceremony: "Johnson Wedding", rsvp: "Confirmed", dietary: "Vegetarian", plusOne: true, notes: "" },
    { name: "James Wilson", email: "james@email.com", phone: "(555) 234-5678", ceremony: "Johnson Wedding", rsvp: "Confirmed", dietary: "None", plusOne: true, notes: "" },
    { name: "Emma Davis", email: "emma@email.com", phone: "(555) 345-6789", ceremony: "Tech Corp Gala", rsvp: "Pending", dietary: "Gluten-free", plusOne: false, notes: "" },
    { name: "Michael Brown", email: "michael@email.com", phone: "(555) 456-7890", ceremony: "Smith Anniversary", rsvp: "Confirmed", dietary: "None", plusOne: true, notes: "" },
    { name: "Lisa Johnson", email: "lisa@email.com", phone: "(555) 567-8901", ceremony: "Johnson Wedding", rsvp: "Declined", dietary: "Vegan", plusOne: false, notes: "" },
];
export const defaultVendors = [
    {
        name: "Bloom Flowers Co.",
        category: "Florist",
        contact: "Maria Garcia",
        email: "maria@bloom.com",
        phone: "(555) 111-2222",
        location: "Downtown",
        rating: 5,
        status: "Active",
        description: "Bloom Flowers Co. creates bespoke floral arrangements for weddings and events. They specialize in seasonal blooms and sustainable sourcing.",
        reviews: [
            { id: "r1", author: "Sarah & Michael", rating: 5, date: "2024-09-12", text: "Absolutely stunning arrangements. Maria listened to our vision and delivered beyond expectations. Guests kept asking about the florals. Highly recommend for any wedding looking for romantic, lush designs." },
            { id: "r2", author: "Anna K.", rating: 5, date: "2024-07-02", text: "Quick, professional, and beautiful work. The centerpieces were the highlight of our reception. Communication was excellent." },
        ],
    },
    {
        name: "Elite Catering",
        category: "Catering",
        contact: "Chef Robert",
        email: "robert@elite.com",
        phone: "(555) 222-3333",
        location: "Midtown",
        rating: 4,
        status: "Active",
        description: "Elite Catering provides full-service catering with customizable menus, tastings, and staffing.",
        reviews: [
            { id: "r3", author: "Corporate Events", rating: 4, date: "2024-10-01", text: "The food was well-executed and service ran smoothly. A few timing hiccups but overall very satisfied." },
        ],
    },
    {
        name: "Melody Band",
        category: "Entertainment",
        contact: "Jake Miller",
        email: "jake@melody.com",
        phone: "(555) 333-4444",
        location: "West Side",
        rating: 5,
        status: "Pending",
        description: "Live entertainment for receptions, galas, and private events.",
        reviews: [
            { id: "r4", author: "Taylor R.", rating: 5, date: "2024-08-18", text: "Incredible energy and a great set list. They kept the dance floor full all night." },
        ],
    },
    {
        name: "Capture Moments",
        category: "Photography",
        contact: "Lisa Chen",
        email: "lisa@capture.com",
        phone: "(555) 444-5555",
        location: "East Side",
        rating: 4,
        status: "Active",
        description: "Photography and video coverage for events of all sizes.",
        reviews: [
            { id: "r5", author: "Megan L.", rating: 4, date: "2024-09-01", text: "Beautiful photos, responsive communication, and fast delivery." },
        ],
    },
    {
        name: "Sweet Delights Bakery",
        category: "Bakery",
        contact: "Anna Smith",
        email: "anna@sweet.com",
        phone: "(555) 555-6666",
        location: "Uptown",
        rating: 5,
        status: "Active",
        description: "Custom cakes, desserts, and sweet tables for special occasions.",
        reviews: [
            { id: "r6", author: "Olivia P.", rating: 5, date: "2024-06-11", text: "The cake looked amazing and tasted even better. Guests loved the dessert table." },
        ],
    },
];
export const defaultTasks = [
    { title: "Finalize menu selections", description: "Review and confirm final menu choices with caterer", ceremony: "Johnson Wedding", dueDate: "2024-12-10", priority: "High", status: "Done", assignee: "You", category: "Catering" },
    { title: "Confirm flower arrangements", description: "Approve final flower designs with florist", ceremony: "Johnson Wedding", dueDate: "2024-12-12", priority: "High", status: "In Progress", assignee: "Maria", category: "Decoration" },
    { title: "Send final guest count", description: "Provide venue with confirmed guest numbers", ceremony: "Johnson Wedding", dueDate: "2024-12-08", priority: "High", status: "Todo", assignee: "You", category: "Venue" },
    { title: "Review AV requirements", description: "Confirm microphones and speakers for speeches", ceremony: "Tech Corp Gala", dueDate: "2024-12-15", priority: "Medium", status: "Todo", assignee: "Jake", category: "Entertainment" },
    { title: "Order table decorations", description: "Purchase centerpieces and table linens", ceremony: "Smith Anniversary", dueDate: "2024-12-20", priority: "Low", status: "Todo", assignee: "You", category: "Decoration" },
];
export const defaultCeremonies = [
    { name: "Johnson Wedding", type: "Wedding", date: "2024-12-15", time: "14:00", venue: "Grand Ballroom", address: "123 Event Ave", expectedGuests: "150", budget: "$25,000", description: "A beautiful winter wedding." },
    { name: "Tech Corp Gala", type: "Corporate", date: "2024-12-20", time: "18:00", venue: "Convention Center", address: "456 Business Blvd", expectedGuests: "300", budget: "$50,000", description: "Annual corporate celebration." },
    { name: "Smith Anniversary", type: "Anniversary", date: "2025-01-05", time: "16:00", venue: "Garden Estate", address: "789 Garden Lane", expectedGuests: "50", budget: "$10,000", description: "25th wedding anniversary celebration." },
    { name: "Garcia Celebration", type: "Birthday", date: "2025-01-15", time: "19:00", venue: "Rooftop Venue", address: "321 Skyline Dr", expectedGuests: "80", budget: "$15,000", description: "50th birthday party." },
    { name: "Wilson Renewal", type: "Vow Renewal", date: "2025-02-14", time: "11:00", venue: "Beach Resort", address: "555 Ocean Way", expectedGuests: "40", budget: "$20,000", description: "Romantic vow renewal ceremony." },
];
