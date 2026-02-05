import { useNavigate } from 'react-router-dom';
import { TrendingUp, Brain, Target, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-purple-600/10 to-blue-600/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8">
              <Sparkles size={16} />
              <span>Now with Kimi AI Integration</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master Your Trading with
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Professional trading journal with advanced analytics, 
              institutional-grade strategies, and AI-driven trade planning.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-lg px-8 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/25"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/learning')}
                className="flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur border border-gray-700 text-white text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition-all"
              >
                Explore Strategies
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">76%</div>
                <div className="text-gray-500 text-sm">Win Rate Potential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-gray-500 text-sm">Pro Strategies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI</div>
                <div className="text-gray-500 text-sm">Trade Planner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Trade Like a Pro</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Built by traders, for traders. Institutional-grade tools without the institutional price.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={Brain}
            title="Kimi AI Planner"
            description="Get institutional-grade trade analysis with fundamental and technical bias, entry zones, and risk warnings."
            color="purple"
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Advanced Analytics"
            description="Track your equity curve, win rates by strategy, psychology insights, and performance metrics."
            color="green"
          />
          <FeatureCard 
            icon={Target}
            title="Strategy Library"
            description="Learn ICT, SMC, and Price Action with curated video content and step-by-step execution guides."
            color="orange"
          />
          <FeatureCard 
            icon={Shield}
            title="Risk Management"
            description="Prop firm style risk limits, daily loss alerts, and psychology tracking to protect your capital."
            color="blue"
          />
        </div>
      </div>

      {/* Strategies Section */}
      <div className="bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Proven Trading Strategies</h2>
            <p className="text-gray-400">Learn the same strategies used by institutional traders</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'ICT Silver Bullet', winRate: '76%', desc: 'High-probability NY session setups' },
              { name: 'SMC Order Blocks', winRate: '71%', desc: 'Institutional order flow trading' },
              { name: 'Price Action', winRate: '68%', desc: 'Pure price structure analysis' },
              { name: 'Power of 3', winRate: '73%', desc: 'Accumulation, manipulation, distribution' },
            ].map((strategy, i) => (
              <div key={i} className="glass-card p-6 text-center group hover:border-orange-500/30 transition-colors">
                <div className="text-3xl font-bold text-orange-400 mb-2">{strategy.winRate}</div>
                <h3 className="font-semibold text-white mb-1">{strategy.name}</h3>
                <p className="text-gray-500 text-sm">{strategy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 p-12 text-center">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <Zap className="mx-auto text-white/80 mb-4" size={48} />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Start Your Trading Journey Today</h2>
            <p className="text-orange-100 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of traders who have transformed their performance with structured journaling and AI-powered insights.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2024 Golden Passage. Built for serious traders.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { 
  icon: typeof TrendingUp; 
  title: string; 
  description: string;
  color: 'purple' | 'green' | 'orange' | 'blue';
}) {
  const colors = {
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30 text-purple-400',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30 text-green-400',
    orange: 'from-orange-600/20 to-orange-900/20 border-orange-500/30 text-orange-400',
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`glass-card p-6 hover:scale-[1.02] transition-all group bg-gradient-to-br ${colors[color]}`}>
      <div className={`w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={colors[color].split(' ').pop()} size={24} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
