import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import './index.css'; 
import TeamMembersList from "./components/TeamMembersList";
import TeamMemberPage from "./pages/TeamMemberPage";




const queryClient = new QueryClient();
const TeamMemberPageWrapper: React.FC = () => {
  const { memberName } = useParams<{ memberName: string }>();
  return <TeamMemberPage memberName={memberName!} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
         
          <Route path="*" element={<NotFound />} />
          <Route path="/team-members" element={<TeamMembersList />} />
         <Route path="/team_members/:memberName" element={<TeamMemberPageWrapper />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
