import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TokenMetadata {
    name: string;
    symbol: string;
    supply: number;
    top_100_holders: number;
    address: string;
    decimals?: number;
    image?: string;
}

export interface TokenState {
    mintAddress: string;
    tokenData: TokenMetadata | null;
    loading: boolean;
    error: string | null;
    recentSearches: string[];
}

export interface TokenActions {
    setMintAddress: (address: string) => void;
    fetchTokenData: (address: string) => Promise<void>;
    clearError: () => void;
    clearTokenData: () => void;
    addToRecentSearches: (address: string) => void;
    removeFromRecentSearches: (address: string) => void;
}

const initialState: TokenState = {
    mintAddress: '',
    tokenData: null,
    loading: false,
    error: null,
    recentSearches: [],
};

export const useTokenStore = create<TokenState & TokenActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setMintAddress: (address: string) => {
                    set({ mintAddress: address });
                },

                fetchTokenData: async (address: string) => {
                    if (!address || address.length < 32) {
                        set({ error: "Invalid token address", loading: false });
                        return;
                    }

                    try {
                        set({ loading: true, error: null });

                        // Call Helius RPC
                        const response = await fetch(
                            `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    jsonrpc: "2.0",
                                    id: "1",
                                    method: "getTokenLargestAccounts",
                                    params: [address],
                                }),
                            }
                        );

                        console.log("response", response);

                        if (!response.ok) throw new Error(`RPC request failed: ${response.statusText}`);
                        const { result } = await response.json();

                        if (!result?.value?.length) throw new Error("No holders found for this token");

                        // Combine metadata + holders
                        const metaRes = await fetch(
                            `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ mintAccounts: [address] }),
                            }
                        );

                        const metaJson = await metaRes.json();
                        const meta = metaJson?.[0] ?? {};

                        const tokenData: TokenMetadata = {
                            name: meta?.onChainMetadata?.metadata?.data?.name || "Unknown",
                            symbol: meta?.onChainMetadata?.metadata?.data?.symbol || "N/A",
                            supply: result.value.reduce((sum: number, acc: any) => sum + (acc.uiAmount || 0), 0),
                            top_100_holders: result.value.length,
                            address,
                            decimals: meta?.onChainMetadata?.metadata?.data?.decimals ?? 0,
                            image: meta?.offChainMetadata?.metadata?.image || null,
                        };

                        set({ tokenData, loading: false, mintAddress: address });
                        get().addToRecentSearches(address);
                    } catch (err: any) {
                        console.error("Error fetching token data:", err);
                        set({
                            error: err.message || "Unexpected error fetching token data",
                            loading: false,
                            tokenData: null,
                        });
                    }
                },


                clearError: () => {
                    set({ error: null });
                },

                clearTokenData: () => {
                    set({
                        tokenData: null,
                        mintAddress: '',
                        error: null,
                    });
                },

                addToRecentSearches: (address: string) => {
                    const { recentSearches } = get();
                    const updatedSearches = [
                        address,
                        ...recentSearches.filter(addr => addr !== address),
                    ].slice(0, 10); // Keep only last 10 searches

                    set({ recentSearches: updatedSearches });
                },

                removeFromRecentSearches: (address: string) => {
                    const { recentSearches } = get();
                    set({
                        recentSearches: recentSearches.filter(addr => addr !== address),
                    });
                },
            }),
            {
                name: 'token-storage',
                partialize: (state) => ({
                    recentSearches: state.recentSearches,
                }),
            }
        ),
        {
            name: 'TokenStore',
        }
    )
);

export const tokenDataSelector = (state: TokenState & TokenActions) => state.tokenData;
export const loadingSelector = (state: TokenState & TokenActions) => state.loading;
export const errorSelector = (state: TokenState & TokenActions) => state.error;
export const mintAddressSelector = (state: TokenState & TokenActions) => state.mintAddress;
export const recentSearchesSelector = (state: TokenState & TokenActions) => state.recentSearches;