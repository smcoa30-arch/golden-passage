import { useNavigate } from 'react-router-dom';
import { TrendingUp, Brain, BookOpen, Target } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 lg:py-24">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
          Master Your Trading with{' '}
          <span className="text-orange-600">AI-Powered</span> Insights
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Golden Passage helps forex and stock traders improve performance through 
          structured journaling, advanced analytics, and AI-driven strategies.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-orange-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate('/learning')}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
          >
            Learn More →
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <FeatureCard 
          icon={Brain}
          title="AI Strategies"
          description="Get personalized daily trading strategies powered by AI"
        />
        <FeatureCard 
          icon={TrendingUp}
          title="Trade Tracking"
          description="Log trades with OCR screenshot parsing and detailed analytics"
        />
        <FeatureCard 
          icon={Target}
          title="Performance Analytics"
          description="Track win rates, profit factors, and streaks over time"
        />
        <FeatureCard 
          icon={BookOpen}
          title="Education"
          description="Learn from comprehensive forex guides and strategy tutorials"
        />
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white mt-12">
        <h2 className="text-3xl font-bold mb-4">Start Your 14-Day Free Trial</h2>
        <p className="text-orange-100 mb-6 max-w-xl mx-auto">
          Join thousands of traders who have improved their performance with Golden Passage.
        </p>
        <button 
          onClick={() => alert('Sign up coming soon!')}
          className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { 
  icon: typeof TrendingUp; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-orange-600" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
