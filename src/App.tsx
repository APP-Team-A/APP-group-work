import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TeamMembersList from "./components/TeamMembersList";
import TeamMemberPage from "./pages/TeamMemberPage";
import Navbar from "./components/Navbar";
import './index.css';

const queryClient = new QueryClient();

const TeamMemberPageWrapper: React.FC = () => {
  const { memberName } = useParams<{ memberName: string }>();
  return <TeamMemberPage memberName={memberName!} />;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/team-members" element={<TeamMembersList />} />
              <Route path="/team_members/:memberName" element={<TeamMemberPageWrapper />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;