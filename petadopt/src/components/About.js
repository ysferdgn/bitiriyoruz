import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaPaw, FaUsers, FaHandshake } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaHeart className="text-4xl text-[#4CAF50] mb-4" />,
      title: 'Our Mission',
      description: 'To connect loving homes with pets in need, making the adoption process simple, transparent, and joyful.'
    },
    {
      icon: <FaPaw className="text-4xl text-[#4CAF50] mb-4" />,
      title: 'Pet Care',
      description: 'We ensure all pets are healthy, vaccinated, and ready for their new homes through our thorough vetting process.'
    },
    {
      icon: <FaUsers className="text-4xl text-[#4CAF50] mb-4" />,
      title: 'Community',
      description: 'Join our growing community of pet lovers, volunteers, and advocates working together to make a difference.'
    },
    {
      icon: <FaHandshake className="text-4xl text-[#4CAF50] mb-4" />,
      title: 'Support',
      description: 'We provide ongoing support and resources to help you and your new pet build a lasting relationship.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">About PetAdopt</h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto mt-4">
          Our mission is to connect loving families with pets in need of a forever home.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-800 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="prose prose-lg max-w-none">
          <p>
            PetAdopt was founded in 2024 with a simple yet powerful vision: to create a world where every pet has a loving home. 
            We recognized the challenges in the traditional pet adoption process and set out to build a platform that would make 
            it easier for people to find their perfect companion.
          </p>
          <p>
            Our platform connects pet owners who can no longer care for their pets with individuals and families looking to adopt. 
            We've streamlined the process, making it more transparent and efficient while ensuring the well-being of every pet involved.
          </p>
          <p>
            Today, we're proud to have helped thousands of pets find their forever homes, and we're committed to continuing our 
            mission of making pet adoption accessible to everyone.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
            <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
            <p className="text-gray-800">Founder & CEO</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
            <h3 className="text-xl font-semibold text-gray-900">Jane Smith</h3>
            <p className="text-gray-800">Head of Operations</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
            <h3 className="text-xl font-semibold text-gray-900">Mike Johnson</h3>
            <p className="text-gray-800">Lead Developer</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#4CAF50] text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Whether you're looking to adopt, need to rehome a pet, or want to support our cause, we'd love to have you as part of our community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/search"
            className="px-6 py-3 bg-white text-[#4CAF50] rounded-md hover:bg-gray-100"
          >
            Find a Pet
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 