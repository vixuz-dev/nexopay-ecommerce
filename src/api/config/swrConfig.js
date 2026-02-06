/**
 * SWR default configuration
 * Sets global cache settings for all SWR hooks
 */
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 30 * 60 * 1000, // 30 minutos - evita requests duplicados
  focusThrottleInterval: 30 * 60 * 1000, // 30 minutos
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
  onError: (error, key) => {
    console.error('SWR Error:', error, 'for key:', key);
  },
};

