import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "@/routes/AppRoutes";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import StoreProvider from "@/providers/StoreProvider";

const App = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
        <Toaster position="top-right" richColors />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;
