import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { store } from "@/store";
import { Provider } from 'react-redux';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { injectStore } from './services/api.ts';
import { AuthProvider } from './provider/auth-provider.tsx';

injectStore(store);

createRoot(document.getElementById("root")!).render(
<Provider store={store}>
    <AuthProvider>
        {/* <QueryClientProvider client={queryClient}> */}
        <TooltipProvider>
            <App />
        </TooltipProvider>
    </AuthProvider>
</Provider>);
