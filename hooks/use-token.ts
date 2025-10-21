import { useTokenStore } from '@/store/token-store';
import { useShallow } from 'zustand/react/shallow';

export const useToken = () => {
    return useTokenStore(
        useShallow((state) => ({
            tokenData: state.tokenData,
            loading: state.loading,
            error: state.error,
            mintAddress: state.mintAddress,
            recentSearches: state.recentSearches,
            setMintAddress: state.setMintAddress,
            fetchTokenData: state.fetchTokenData,
            clearError: state.clearError,
            clearTokenData: state.clearTokenData,
            addToRecentSearches: state.addToRecentSearches,
            removeFromRecentSearches: state.removeFromRecentSearches,
        }))
    );
};

// Individual selectors for fine-grained subscriptions
export const useTokenData = () => useTokenStore((state) => state.tokenData);
export const useTokenLoading = () => useTokenStore((state) => state.loading);
export const useTokenError = () => useTokenStore((state) => state.error);
export const useTokenMintAddress = () => useTokenStore((state) => state.mintAddress);
export const useRecentSearches = () => useTokenStore((state) => state.recentSearches);