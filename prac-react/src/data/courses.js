import courseOrganic from '../assets/img/course-organic.jpg';
import courseSustainable from '../assets/img/course-sustainable.jpg';
import courseSoil from '../assets/img/course-soil.jpg';
import courseIrrigation from '../assets/img/course-irrigation.jpg';
import courseCrop from '../assets/img/course-crop.jpg';

export const allCourses = [
    {
        id: 1,
        title: 'Agri-Tech Innovations',
        category: 'Farming Technology',
        image: courseSustainable,
        isNew: true,
        description:
            'Explore cutting-edge agricultural technologies that are revolutionizing modern farming. From precision agriculture to drone technology, this course covers everything you need to know about the future of food production.',
        duration: '4 weeks',
        level: 'Intermediate',
        instructor: 'Dr. Emily Carter',
        lessons: 16,
        topics: [
            'Introduction to Precision Agriculture',
            'Drone Technology in Farming',
            'IoT Sensors & Smart Irrigation',
            'Data Analytics for Crop Monitoring',
            'AI-powered Pest Detection',
        ],
    },
    {
        id: 2,
        title: 'Organic Farming Basics',
        category: 'Sustainable Science',
        image: courseOrganic,
        isNew: true,
        description:
            'Learn the fundamentals of organic farming and discover how to grow crops without synthetic chemicals. This beginner-friendly course covers soil health, composting, natural pest control, and organic certification.',
        duration: '4 weeks',
        level: 'Beginner',
        instructor: 'Prof. Sarah Green',
        lessons: 12,
        topics: [
            'Principles of Organic Agriculture',
            'Building Healthy Soil',
            'Composting Techniques',
            'Natural Pest & Disease Control',
            'Organic Certification Process',
        ],
    },
    {
        id: 3,
        title: 'Sustainable Agriculture',
        category: 'Environment',
        image: courseSoil,
        isNew: false,
        description:
            'Understand sustainable farming practices that protect the environment while maintaining productivity. Learn how to balance economic viability with ecological responsibility in modern agriculture.',
        duration: '4 weeks',
        level: 'Intermediate',
        instructor: 'Dr. Michael Torres',
        lessons: 14,
        topics: [
            'Ecosystem-based Farming',
            'Carbon Sequestration in Soil',
            'Biodiversity in Agriculture',
            'Water Conservation Strategies',
            'Sustainable Supply Chains',
        ],
    },
    {
        id: 4,
        title: 'Soil Science Fundamentals',
        category: 'Agriculture Science',
        image: courseSoil,
        isNew: false,
        description:
            'Deep dive into the science of soil — the foundation of all agriculture. Understand soil composition, pH levels, essential nutrients, and how to optimize your soil for maximum crop yield and long-term fertility.',
        duration: '4 weeks',
        level: 'Beginner',
        instructor: 'Dr. Anika Patel',
        lessons: 10,
        topics: [
            'Soil Composition & Texture',
            'Soil pH & Nutrient Management',
            'Soil Microbiology',
            'Erosion Control Techniques',
            'Soil Testing & Amendments',
        ],
    },
    {
        id: 5,
        title: 'Irrigation Management',
        category: 'Water Resources',
        image: courseIrrigation,
        isNew: false,
        description:
            'Master the art and science of irrigation to optimize water use in agriculture. This course covers drip irrigation, sprinkler systems, water scheduling, and efficient water management strategies for sustainable farming.',
        duration: '4 weeks',
        level: 'Intermediate',
        instructor: 'Eng. James Rivera',
        lessons: 13,
        topics: [
            'Irrigation System Types',
            'Drip & Micro-irrigation',
            'Water Scheduling & Budgeting',
            'Rainwater Harvesting',
            'Smart Irrigation Controllers',
        ],
    },
    {
        id: 6,
        title: 'Crop Protection',
        category: 'Plant Health',
        image: courseCrop,
        isNew: false,
        description:
            'Learn how to protect your crops from pests, diseases, and weeds using integrated pest management (IPM) strategies. This course blends traditional and modern approaches to ensure healthy and productive harvests.',
        duration: '4 weeks',
        level: 'Advanced',
        instructor: 'Dr. Lisa Nguyen',
        lessons: 15,
        topics: [
            'Integrated Pest Management (IPM)',
            'Common Crop Diseases & Identification',
            'Biological Control Methods',
            'Pesticide Safety & Regulations',
            'Field Scouting Techniques',
        ],
    },
];

export const newCourses = [
    {
        id: 101,
        title: 'Agri-Tech Innovations',
        category: 'Farming',
        image: courseSustainable,
        isComingSoon: true,
        description:
            'An exciting upcoming course on the latest agricultural technology trends. Stay tuned for enrollment details.',
        duration: '4 weeks',
        level: 'Intermediate',
        instructor: 'TBA',
        lessons: 0,
        topics: [],
    },
    {
        id: 102,
        title: 'Organic Farming Basics',
        category: 'Sustainable Science',
        image: courseOrganic,
        isComingSoon: true,
        description:
            "A comprehensive beginner's guide to organic farming principles and practices. Coming soon!",
        duration: '4 weeks',
        level: 'Beginner',
        instructor: 'TBA',
        lessons: 0,
        topics: [],
    },
    {
        id: 103,
        title: 'Sustainable Agriculture Practices',
        category: 'Environment',
        image: courseSoil,
        isComingSoon: true,
        description:
            'Learn sustainable practices for the modern farmer. Enrollment details coming soon.',
        duration: '4 weeks',
        level: 'Intermediate',
        instructor: 'TBA',
        lessons: 0,
        topics: [],
    },
];

const _all = [...allCourses, ...newCourses];

export function getCourseById(id) {
    return _all.find((c) => c.id === Number(id)) || null;
}
