const UserController = require('../../controllers/userController');
const { v4: uuidv4 } = require('uuid');

const usersInit = [
    {
        username: 'Alice123',
        email: 'alice123@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Alice',
        last_name: 'Johnson',
        age: 20,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I am a nature enthusiast who loves hiking, traveling, and exploring new places. I also enjoy photography and capturing the beauty of the world.',
        picture_1: '/app/imagesSaved/picture_1_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'JohnDoe44',
        email: 'johndoe44@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'John',
        last_name: 'Doe',
        age: 21,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a cinephile who can spend hours discussing movies. Food is my passion, and I enjoy trying new cuisines. Traveling and exploring new cultures is something I look forward to.',
        picture_1: '/app/imagesSaved/picture_2_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'Sophia89',
        email: 'sophia89@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Sophia',
        last_name: 'Miller',
        age: 21,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Female',
        biography: 'I\'m a fitness enthusiast who enjoys long runs and outdoor workouts. Exploring new cities and their cultures is a big part of my life.',
        picture_1: '/app/imagesSaved/picture_3_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'DavidSmith77',
        email: 'davidsmith77@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'David',
        last_name: 'Smith',
        age: 22,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Male',
        biography: 'I have a passion for music and love playing the guitar. I\'m also a foodie and enjoy cooking for my friends. Traveling and discovering new places is a big part of my life.',
        picture_1: '/app/imagesSaved/picture_4_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
];

const userInit2 = [
    {
        username: 'SarahSmith28',
        email: 'sarahsmith28@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Sarah',
        last_name: 'Smith',
        age: 23,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I\'m an avid reader and love spending my free time with a good book. I also enjoy cooking and trying out new recipes. Nature walks and gardening are my hobbies.',
        picture_1: '/app/imagesSaved/picture_5_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'MarkRoberts42',
        email: 'markroberts42@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Mark',
        last_name: 'Roberts',
        age: 25,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Male',
        biography: 'I am a tech enthusiast and love building and programming computers. I also enjoy playing tennis and staying active. Traveling to new places is something I look forward to.',
        picture_1: '/app/imagesSaved/picture_6_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'EmmaBrown31',
        email: 'emmabrown31@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Emma',
        last_name: 'Brown',
        age: 24,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I am a painter and I express my thoughts and emotions through my art. I also enjoy horseback riding and the outdoors. Traveling to remote places inspires my creativity.',
        picture_1: '/app/imagesSaved/picture_7_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'MichaelJohnson49',
        email: 'michaeljohnson49@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Michael',
        last_name: 'Johnson',
        age: 24,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a sports enthusiast and love playing basketball and watching football games. I\'m also a pet lover and enjoy spending time with my dog. Weekend road trips are my favorite.',
        picture_1: '/app/imagesSaved/picture_8_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'LilyChen36',
        email: 'lilychen36@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Lily',
        last_name: 'Chen',
        age: 25,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Female',
        biography: 'I am a passionate chef and love experimenting with different cuisines. I also enjoy painting and creating art. Weekend getaways to quiet places are my ideal relaxation.',
        picture_1: '/app/imagesSaved/picture_9_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
];

const userInit3 = [
    {
        username: 'OliviaWilliams52',
        email: 'oliviawilliams52@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Olivia',
        last_name: 'Williams',
        age: 28,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I\'m a bookworm who loves exploring bookstores and libraries. Yoga and meditation are my daily rituals. I enjoy visiting art galleries and finding inspiration in every painting.',
        picture_1: '/app/imagesSaved/picture_10_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'MatthewLee47',
        email: 'matthewlee47@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Matthew',
        last_name: 'Lee',
        age: 29,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a software developer and enjoy coding and building software applications. I\'m a coffee lover and often spend time in cozy cafes. Exploring new cities is my favorite adventure.',
        picture_1: '/app/imagesSaved/picture_11_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'SophieAdams30',
        email: 'sophieadams30@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Sophie',
        last_name: 'Adams',
        age: 31,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Female',
        biography: 'I\'m a professional photographer and love capturing moments with my camera. I also enjoy rock climbing and spending time in the mountains. Adventure is my way of life.',
        picture_1: '/app/imagesSaved/picture_12_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'DanielMoore55',
        email: 'danielmoore55@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Daniel',
        last_name: 'Moore',
        age: 32,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Male',
        biography: 'I am a passionate chef and enjoy experimenting with international cuisines. I also love scuba diving and exploring the underwater world. Traveling to exotic destinations is my dream.',
        picture_1: '/app/imagesSaved/picture_13_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'SophiaWilson28',
        email: 'sophiawilson28@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Sophia',
        last_name: 'Wilson',
        age: 35,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I am an environmental activist who loves nature and wildlife conservation. I also enjoy bird watching and exploring remote forests. Adventure is my passion.',
        picture_1: '/app/imagesSaved/picture_14_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'JamesBrown39',
        email: 'jamesbrown39@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'James',
        last_name: 'Brown',
        age: 32,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a musician and love playing the piano. I\'m also a foodie and enjoy trying out new restaurants and cuisines. Traveling to different countries to explore their music and food is my dream.',
        picture_1: '/app/imagesSaved/picture_15_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'AvaAnderson32',
        email: 'avaanderson32@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Ava',
        last_name: 'Anderson',
        age: 36,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Female',
        biography: 'I\'m a travel blogger and enjoy exploring off-the-beaten-path destinations. I also love painting and expressing my creativity. Adventure is my way of life.',
        picture_1: '/app/imagesSaved/picture_16_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'DanielWilson45',
        email: 'danielwilson45@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Daniel',
        last_name: 'Wilson',
        age: 34,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Male',
        biography: 'I am a tech geek and enjoy programming and building software. I also love hiking and exploring the great outdoors. Traveling to remote tech conferences is my ideal adventure.',
        picture_1: '/app/imagesSaved/picture_17_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'OliverSmith32',
        email: 'oliversmith32@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Oliver',
        last_name: 'Smith',
        age: 38,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a nature lover who enjoys hiking and camping in the wilderness. I also love playing the guitar and creating music. Exploring national parks and their beauty is my passion.',
        picture_1: '/app/imagesSaved/picture_18_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
];

const userInit4 = [
    {
        username: 'EmilySmith27',
        email: 'emilysmith27@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Emily',
        last_name: 'Smith',
        age: 42,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I\'m a fashion designer with a passion for creating unique clothing. I also enjoy dancing and exploring the art of different cultures. Traveling to fashion capitals inspires my designs.',
        picture_1: '/app/imagesSaved/picture_19_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'WilliamJohnson34',
        email: 'williamjohnson34@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'William',
        last_name: 'Johnson',
        age: 45,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am a scientist and love conducting experiments in the lab. I also enjoy stargazing and exploring the mysteries of the universe. Traveling to observatories is my favorite pastime.',
        picture_1: '/app/imagesSaved/picture_20_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'EllaDavis29',
        email: 'elladavis29@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Ella',
        last_name: 'Davis',
        age: 51,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Female',
        biography: 'I\'m an environmental activist who loves planting trees and preserving the planet. I also enjoy bird watching and connecting with nature. Exploring untouched forests is my ideal adventure.',
        picture_1: '/app/imagesSaved/picture_21_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'BenjaminMiller31',
        email: 'benjaminmiller31@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Benjamin',
        last_name: 'Miller',
        age: 63,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Male',
        biography: 'I am a chef with a passion for creating exquisite dishes. I also enjoy underwater photography and exploring coral reefs. Traveling to remote islands is my dream.',
        picture_1: '/app/imagesSaved/picture_22_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'SophieTaylor26',
        email: 'sophietaylor26@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Sophie',
        last_name: 'Taylor',
        age: 65,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I\'m a veterinarian who loves caring for animals and exploring wildlife. I also enjoy painting and capturing the beauty of nature. Traveling to wildlife reserves is my passion.',
        picture_1: '/app/imagesSaved/picture_23_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 48.856614,
        longitude: 2.3522219,
        city: "Paris"
    },
    {
        username: 'JamesWilson40',
        email: 'jameswilson40@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'James',
        last_name: 'Wilson',
        age: 46,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I\'m a musician who loves playing the saxophone. I also enjoy gourmet cooking and discovering new recipes. Traveling to jazz festivals around the world is my dream.',
        picture_1: '/app/imagesSaved/picture_24_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'LiamBrown33',
        email: 'liambrown33@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Liam',
        last_name: 'Brown',
        age: 43,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I am an explorer and love hiking in the world\'s tallest mountains. I also enjoy playing the piano and composing music. Traveling to remote mountain regions is my passion.',
        picture_1: '/app/imagesSaved/picture_25_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'MiaRoberts28',
        email: 'miaroberts28@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Mia',
        last_name: 'Roberts',
        age: 56,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Female',
        sexual_preferences: 'Male',
        biography: 'I\'m an archaeologist who loves exploring ancient ruins and uncovering history. I also enjoy astronomy and stargazing at night. Traveling to archaeological sites around the world is my dream.',
        picture_1: '/app/imagesSaved/picture_26_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
    {
        username: 'NoahChen30',
        email: 'noahchen30@yopmail.com',
        password: '$2y$10$C1uL8np0wHFh3I4HwbgyeOJUAX2xYYJBGTBzB9/Ml6JGDQjOkq9GK',
        first_name: 'Noah',
        last_name: 'Chen',
        age: 61,
        token: uuidv4(),
        token_creation: UserController._getTimestampString(),
        token_expiration: UserController._getTimestampString(1),
        email_checked: true,
        complete_register: true,
        gender: 'Male',
        sexual_preferences: 'Female',
        biography: 'I\'m a marine biologist who loves diving deep into the ocean to study marine life. I also enjoy sculpture and creating art from oceanic inspiration. Traveling to coral reefs around the world is my passion.',
        picture_1: '/app/imagesSaved/picture_27_1.jpeg',
        picture_2: null,
        picture_3: null,
        picture_4: null,
        picture_5: null,
        fame_rating: 0,
        location_permission: true,
        latitude: 45.764043,
        longitude: 4.835659,
        city: "Lyon"
    },
];

const randomUsersForInit = usersInit.concat(userInit2, userInit3, userInit4);

module.exports = {
    randomUsersForInit
};