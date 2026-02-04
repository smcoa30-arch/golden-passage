import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tradesApi } from '../../services/api';

interface Trade {
  id: string;
  instrument: string;
  instrumentType: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  positionSize: number;
  profitLoss?: number;
  status: 'open' | 'closed' | 'pending';
  entryDate: string;
  exitDate?: string;
}

interface TradesState {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  stats: any | null;
}

const initialState: TradesState = {
  trades: [],
  loading: false,
  error: null,
  stats: null,
};

export const fetchTrades = createAsyncThunk(
  'trades/fetchTrades',
  async (params?: any) => {
    const response = await tradesApi.getAll(params);
    return response.data.data.trades;
  }
);

export const createTrade = createAsyncThunk(
  'trades/createTrade',
  async (data: any) => {
    const response = await tradesApi.create(data);
    return response.data.data.trade;
  }
);

export const fetchTradeStats = createAsyncThunk(
  'trades/fetchStats',
  async () => {
    const response = await tradesApi.getStats();
    return response.data.data;
  }
);

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trades
      .addCase(fetchTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action: PayloadAction<Trade[]>) => {
        state.loading = false;
        state.trades = action.payload;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trades';
      })
      // Create trade
      .addCase(createTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrade.fulfilled, (state, action: PayloadAction<Trade>) => {
        state.loading = false;
        state.trades.unshift(action.payload);
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create trade';
      })
      // Fetch stats
      .addCase(fetchTradeStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = tradesSlice.actions;
export default tradesSlice.reducer;
