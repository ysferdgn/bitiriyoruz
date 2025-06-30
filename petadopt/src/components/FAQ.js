import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the pet adoption process work?',
      answer: `The pet adoption process typically involves the following steps:
      1. Browse available pets on our platform
      2. Contact the pet owner to learn more about the pet
      3. Arrange a meeting to interact with the pet
      4. Complete the adoption paperwork
      5. Take your new companion home!
      
      We ensure all pets are healthy and ready for adoption through our thorough vetting process.`
    },
    {
      question: 'What are the requirements for adopting a pet?',
      answer: `To adopt a pet through our platform, you must:
      - Be at least 18 years old
      - Have a stable living situation
      - Be able to provide proper care and attention
      - Have the financial means to support a pet
      - Complete our adoption application
      - Agree to our adoption terms and conditions`
    },
    {
      question: 'How much does it cost to adopt a pet?',
      answer: `The adoption fee varies depending on the pet and its circumstances. Generally, the fee covers:
      - Initial veterinary care
      - Vaccinations
      - Spaying/neutering
      - Microchipping
      - Basic supplies
      
      The exact cost will be listed in each pet's profile.`
    },
    {
      question: "What if the adoption doesn't work out?",
      answer: `We understand that sometimes adoptions don't work out as planned. In such cases:
      1. Contact us immediately
      2. We'll help you find a solution
      3. If necessary, we can help rehome the pet
      4. We may be able to provide additional support or resources
      
      Our priority is ensuring the well-being of both the pet and the adopter.`
    },
    {
      question: 'How do I list my pet for adoption?',
      answer: `To list your pet for adoption:
      1. Create an account on our platform
      2. Click "Add Pet" in your profile
      3. Fill out the pet's information
      4. Upload clear photos
      5. Provide detailed description
      6. Submit for review
      
      Once approved, your pet will be listed on our platform.`
    },
    {
      question: 'What support do you provide after adoption?',
      answer: `We offer various forms of post-adoption support:
      - 24/7 access to our pet care guides
      - Emergency contact information
      - Training resources
      - Veterinary recommendations
      - Community support groups
      - Regular check-ins
      
      We're committed to ensuring successful adoptions and happy pets!`
    },
    {
      question: 'Are all pets on the platform vaccinated?',
      answer: `Yes, we require all pets to be:
      - Up-to-date on core vaccinations
      - Spayed or neutered (unless too young)
      - Microchipped
      - Given a clean bill of health by a veterinarian
      
      This information is verified and documented in each pet's profile.`
    },
    {
      question: 'Can I adopt if I live in an apartment?',
      answer: `Yes, you can adopt while living in an apartment! However, you should:
      - Check your building's pet policies
      - Consider the pet's size and energy level
      - Ensure you have enough space
      - Plan for regular exercise
      - Have a backup plan for emergencies
      
      We can help you find a pet that's suitable for apartment living.`
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <FaQuestionCircle className="text-6xl text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-800 max-w-3xl mx-auto">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="text-[#4CAF50]" />
              ) : (
                <FaChevronDown className="text-[#4CAF50]" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  {faq.answer.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-800 mb-2">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 bg-[#4CAF50] text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-lg mb-6">
          Can't find what you're looking for? Our team is here to help!
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-white text-[#4CAF50] rounded-md hover:bg-gray-100"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQ; 