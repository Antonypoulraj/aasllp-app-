import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import EmployeePortal from "./pages/EmployeePortal";
import AttendancePortal from "./pages/AttendancePortal";
import ToolStocksPortal from "./pages/ToolStocksPortal";
import RawMaterialsPortal from "./pages/RawMaterialsPortal";
import ProductionPortal from "./pages/ProductionPortal";
import AddProductionRecord from "./pages/AddProductionRecord";
import AddEmployee from "./pages/AddEmployee";
import AddAttendance from "./pages/AddAttendance";
import AddToolStock from "./pages/AddToolStock";
import AddRawMaterial from "./pages/AddRawMaterial";
import NotFound from "./pages/NotFound";
import CreateAccount from "./pages/CreateAccount";
import VerificationMail from "./pages/VerificationMail";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/verification-mail" element={<VerificationMail />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute>
            <EmployeePortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee/add" 
        element={
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <AttendancePortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance/add" 
        element={
          <ProtectedRoute>
            <AddAttendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/toolstocks" 
        element={
          <ProtectedRoute>
            <ToolStocksPortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/toolstocks/add" 
        element={
          <ProtectedRoute>
            <AddToolStock />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/toolstocks/edit/:id" 
        element={
          <ProtectedRoute>
            <AddToolStock />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rawmaterials" 
        element={
          <ProtectedRoute>
            <RawMaterialsPortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rawmaterials/add" 
        element={
          <ProtectedRoute>
            <AddRawMaterial />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rawmaterials/edit/:id" 
        element={
          <ProtectedRoute>
            <AddRawMaterial />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/production" 
        element={
          <ProtectedRoute>
            <ProductionPortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/production/add" 
        element={
          <ProtectedRoute>
            <AddProductionRecord />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/production/edit/:id" 
        element={
          <ProtectedRoute>
            <AddProductionRecord />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


'export{}'