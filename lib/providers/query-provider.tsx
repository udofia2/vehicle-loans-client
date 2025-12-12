'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * React Query Provider component
 * Based on @tanstack/react-query documentation
 */

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors (client errors)
              if (typeof error === 'object' && error !== null && 'status' in error) {
                const status = (error as { status: number }).status
                if (status >= 400 && status < 500) {
                  return false
                }
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
          },
          mutations: {
            retry: false, // Don't retry mutations by default
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}