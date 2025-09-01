import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssetDetails from "./pages/AssetDetails";
import ViewAssets from "./pages/ViewAssets";
import StartTokenization from "./pages/StartTokenization";
import LearnHowItWorks from "./pages/LearnHowItWorks";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import Pools from "./pages/Pools";
import NFTs from "./pages/NFTs";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import DashboardLayout from "./components/DashboardLayout";
import KYC from "./pages/KYC";
import AssetPledging from "./pages/AssetPledging";
import Marketplace from "./pages/Marketplace";
import MyTokens from "./pages/MyTokens";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/asset/:assetId" element={<AssetDetails />} />
          <Route path="/assets" element={<ViewAssets />} />
          <Route path="/learn-how-it-works" element={<LearnHowItWorks />} />
          <Route path="/start-tokenization" element={<StartTokenization />} />
          
          {/* Dashboard Layout Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="asset-pledging" element={<AssetPledging />} />
            <Route path="my-tokens" element={<MyTokens />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="liquidity" element={<Pools />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminPanel />} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="pools" element={<Pools />} />
            <Route path="nfts" element={<NFTs />} />
            <Route path="portfolio" element={<Portfolio />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
