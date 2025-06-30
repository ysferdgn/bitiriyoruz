import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShare, FaBookmark, FaHeart, FaCalendarAlt, FaUser, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const PetGuideArticle = () => {
  const { articleId } = useParams();

  // This would typically come from an API or CMS
  const article = {
    id: articleId,
    title: 'How to Choose the Right Dog Breed',
    category: 'Choosing the Right Pet',
    author: 'Dr. Sarah Johnson',
    date: 'March 15, 2024',
    readTime: '8 min read',
    content: `
      <p>Choosing the right dog breed is one of the most important decisions you'll make as a pet owner. It's not just about finding a cute puppy - it's about finding a companion that fits your lifestyle, living situation, and personality.</p>
      
      <h2>Consider Your Living Space</h2>
      <p>Your living situation plays a crucial role in determining which dog breed is right for you. Consider the following:</p>
      <ul>
        <li>Apartment living vs. house with yard</li>
        <li>Space available for the dog</li>
        <li>Local regulations and restrictions</li>
      </ul>

      <h2>Lifestyle Compatibility</h2>
      <p>Your daily routine and activity level should match your potential dog's needs:</p>
      <ul>
        <li>Exercise requirements</li>
        <li>Grooming needs</li>
        <li>Training difficulty</li>
        <li>Socialization needs</li>
      </ul>

      <h2>Family Considerations</h2>
      <p>If you have a family, consider these important factors:</p>
      <ul>
        <li>Children's ages and activity levels</li>
        <li>Other pets in the household</li>
        <li>Family members' allergies</li>
        <li>Time available for training and care</li>
      </ul>
    `,
    relatedArticles: [
      {
        id: 'choosing-cat',
        title: 'Selecting the Perfect Cat',
        excerpt: 'Understanding different cat personalities and finding your ideal match.'
      },
      {
        id: 'first-time-owner',
        title: 'First-Time Pet Owner Guide',
        excerpt: 'Essential tips for those considering their first pet adoption.'
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Navigation */}
      <Link
        to="/pet-guide"
        className="inline-flex items-center text-[#4CAF50] hover:text-[#388E3C] mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Back to Pet Guide
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <span className="text-gray-700">By {article.author}</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-gray-700 hover:text-[#4CAF50]">
              <FaFacebookF />
            </button>
            <button className="text-gray-700 hover:text-[#4CAF50]">
              <FaTwitter />
            </button>
            <button className="text-gray-700 hover:text-[#4CAF50]">
              <FaLinkedinIn />
            </button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Related Articles */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {article.relatedArticles.map((related) => (
            <Link
              key={related.id}
              to={`/pet-guide/${related.id}`}
              className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{related.title}</h3>
              <p className="text-gray-800">{related.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PetGuideArticle; 