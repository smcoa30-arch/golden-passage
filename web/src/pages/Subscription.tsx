import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  CreditCard, 
  Wallet,
  Bitcoin,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    period: '14 days',
    description: 'Full access for 14 days',
    features: [
      'AI Trade Assistant',
      'Unlimited trade logging',
      'Basic analytics',
      'Journal & checklists',
      'Learning section',
    ],
    notIncluded: [
      'Priority AI processing',
      'Advanced analytics',
      'Export reports',
    ],
    popular: false,
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline' as const,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 11,
    period: 'month',
    description: 'Unlock full potential',
    features: [
      'Everything in Free Trial',
      'Priority AI processing',
      'Advanced analytics & insights',
      'Export PDF & CSV reports',
      'Custom strategies',
      'Email notifications',
      'API access',
      'Priority support',
    ],
    notIncluded: [],
    popular: true,
    buttonText: 'Upgrade Now',
    buttonVariant: 'primary' as const,
  },
];

const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Credit Card', icon: CreditCard, color: 'bg-blue-600' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'bg-blue-800' },
  { id: 'usdt', name: 'USDT (TRC20)', icon: Bitcoin, color: 'bg-green-600' },
];

export function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (selectedPlan === 'free') {
      // Start free trial
      setLoading(true);
      // TODO: Call backend to start free trial
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
      return;
    }

    setLoading(true);
    
    // Handle different payment methods
    switch (selectedPayment) {
      case 'stripe':
        // TODO: Call backend to create Stripe checkout session
        console.log('Redirecting to Stripe...');
        break;
      case 'paypal':
        // TODO: Call backend to create PayPal order
        console.log('Redirecting to PayPal...');
        break;
      case 'usdt':
        // TODO: Show USDT payment instructions
        console.log('Showing USDT payment...');
        break;
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
            <p className="text-gray-400 mt-1">
              Upgrade anytime to unlock premium features
            </p>
          </div>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-orange-600/20 to-purple-600/20 border border-orange-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Sparkles className="text-orange-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Start with 14 Days Free
              </h3>
              <p className="text-gray-400 text-sm">
                Full access to all features. No credit card required. 
                Upgrade anytime during or after your trial.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plans */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-br from-orange-600/20 to-purple-600/20 border-2 border-orange-500'
                    : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-br from-orange-500 to-purple-500'
                        : 'bg-gray-800'
                    }`}
                  >
                    {plan.popular ? (
                      <Crown className="text-white" size={20} />
                    ) : (
                      <Sparkles className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check
                        size={16}
                        className={
                          plan.popular ? 'text-orange-400' : 'text-green-400'
                        }
                      />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-gray-600" />
                      <span className="text-gray-500 text-sm line-through">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div
                    className={`w-full h-2 rounded-full ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-orange-500 to-purple-500'
                        : 'bg-gray-800'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Payment Methods */}
            {selectedPlan === 'premium' && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        selectedPayment === method.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center`}
                      >
                        <method.icon className="text-white" size={20} />
                      </div>
                      <span className="flex-1 text-left text-white font-medium">
                        {method.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedPayment === method.id
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-600'
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <Check size={12} className="text-white m-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white capitalize">{selectedPlan}</span>
                </div>
                {selectedPlan === 'premium' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white">$11.00/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment</span>
                      <span className="text-white capitalize">
                        {selectedPayment}
                      </span>
                    </div>
                  </>
                )}
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-2xl font-bold text-white">
                      ${selectedPlan === 'premium' ? '11.00' : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-xl font-medium hover:from-orange-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : selectedPlan === 'free' ? (
                  <>
                    <Sparkles size={20} />
                    Start Free Trial
                  </>
                ) : (
                  <>
                    <Crown size={20} />
                    Upgrade to Premium
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Secure payment processing. Cancel anytime.
              </p>
            </div>

            {/* FAQ */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                FAQ
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white font-medium mb-1">
                    Can I cancel anytime?
                  </p>
                  <p className="text-gray-400">
                    Yes, you can cancel your subscription at any time. No questions asked.
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    What happens after the trial?
                  </p>
                  <p className="text-gray-400">
                    You can upgrade to Premium or continue with limited free features.
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    Is there a refund policy?
                  </p>
                  <p className="text-gray-400">
                    7-day money-back guarantee for Premium subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
