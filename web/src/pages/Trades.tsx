import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, where, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface Trade {
  id: string;
  pair: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  pnl: number;
  date: string;
  strategy: string;
  notes?: string;
  lotSize?: number;
  userId: string;
}

const strategies = ['Trend Following', 'Breakout', 'Support/Resistance', 'Scalping', 'News Trading', 'Other'];
const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'XAU/USD', 'BTC/USD', 'ETH/USD'];

export function Trades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    pair: 'EUR/USD',
    type: 'Buy' as 'Buy' | 'Sell',
    entry: '',
    exit: '',
    lotSize: '',
    strategy: 'Trend Following',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (!user) return;

    const tradesQuery = query(
      collection(db, 'trades'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(tradesQuery, (snapshot) => {
      const tradesData: Trade[] = [];
      snapshot.docs.forEach((doc) => {
        tradesData.push({ id: doc.id, ...doc.data() } as Trade);
      });
      setTrades(tradesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const entryPrice = parseFloat(formData.entry);
    const exitPrice = parseFloat(formData.exit);
    const lotSize = parseFloat(formData.lotSize) || 1;
    
    // Calculate P&L
    let pnl = 0;
    if (formData.type === 'Buy') {
      pnl = (exitPrice - entryPrice) * lotSize * 100000; // Standard lot
    } else {
      pnl = (entryPrice - exitPrice) * lotSize * 100000;
    }

    const tradeData = {
      ...formData,
      entry: entryPrice,
      exit: exitPrice,
      lotSize,
      pnl: Math.round(pnl * 100) / 100,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    try {
      if (editingTrade) {
        await updateDoc(doc(db, 'trades', editingTrade.id), tradeData);
        setEditingTrade(null);
      } else {
        await addDoc(collection(db, 'trades'), tradeData);
      }
      
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving trade:', error);
      alert('Error saving trade. Please try again.');
    }
  };

  const handleDelete = async (tradeId: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;
    
    try {
      await deleteDoc(doc(db, 'trades', tradeId));
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Error deleting trade. Please try again.');
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData({
      pair: trade.pair,
      type: trade.type,
      entry: trade.entry.toString(),
      exit: trade.exit.toString(),
      lotSize: trade.lotSize?.toString() || '',
      strategy: trade.strategy,
      date: trade.date,
      notes: trade.notes || '',
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      pair: 'EUR/USD',
      type: 'Buy',
      entry: '',
      exit: '',
      lotSize: '',
      strategy: 'Trend Following',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const filteredTrades = trades.filter((trade) => {
    // Search filter
    if (search && !trade.pair.toLowerCase().includes(search.toLowerCase()) && 
        !trade.strategy.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter === 'win') return trade.pnl > 0;
    if (filter === 'loss') return trade.pnl < 0;
    return true;
  });

  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winCount = trades.filter(t => t.pnl > 0).length;
  const lossCount = trades.filter(t => t.pnl < 0).length;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-600 text-sm">Total Trades</p>
          <p className="text-2xl font-bold">{trades.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-600 text-sm">Win/Loss</p>
          <p className="text-2xl font-bold text-green-600">{winCount}/{lossCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-600 text-sm">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalPnl.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trades</h1>
        <button 
          onClick={() => { resetForm(); setEditingTrade(null); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Log Trade
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search trades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Trades</option>
            <option value="win">Winners</option>
            <option value="loss">Losers</option>
          </select>
        </div>
      </div>

      {/* Trades List */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading trades...</div>
      ) : filteredTrades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">No trades found</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-orange-600 hover:underline"
          >
            Log your first trade
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pair</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Entry</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Exit</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">P&L</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Strategy</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{trade.date}</td>
                  <td className="py-3 px-4 font-medium">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${trade.type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{trade.entry}</td>
                  <td className="py-3 px-4 text-gray-600">{trade.exit}</td>
                  <td className={`py-3 px-4 font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{trade.strategy}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(trade)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(trade.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingTrade ? 'Edit Trade' : 'Log New Trade'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pair</label>
                  <select 
                    value={formData.pair}
                    onChange={(e) => setFormData({...formData, pair: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {pairs.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'Buy'})}
                      className={`flex-1 py-2 rounded-lg ${formData.type === 'Buy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'Sell'})}
                      className={`flex-1 py-2 rounded-lg ${formData.type === 'Sell' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
                    <input 
                      type="number"
                      step="0.00001"
                      required
                      value={formData.entry}
                      onChange={(e) => setFormData({...formData, entry: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1.08500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exit Price</label>
                    <input 
                      type="number"
                      step="0.00001"
                      required
                      value={formData.exit}
                      onChange={(e) => setFormData({...formData, exit: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1.09250"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lot Size</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.lotSize}
                    onChange={(e) => setFormData({...formData, lotSize: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="1.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
                  <select 
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {strategies.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Trade notes, emotions, lessons learned..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    {editingTrade ? 'Update' : 'Save'} Trade
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
