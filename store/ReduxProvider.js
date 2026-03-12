"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,   // 5 minutes
//       gcTime: 1000 * 60 * 10,     // keep cache for 10 minutes
//     },
//   },
// });
// const persister = createSyncStoragePersister({
//   storage: typeof window !== "undefined" ? window.localStorage : undefined,
// });

//  return (
//     <Provider store={store}>
//       <PersistQueryClientProvider
//         client={queryClient}
//         persistOptions={{ persister }}
//       >
//         {children}
//       </PersistQueryClientProvider>
//     </Provider>
//   );


const queryClient = new QueryClient();
export default function ReduxProvider({ children }) {
  return <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </Provider>;
}
