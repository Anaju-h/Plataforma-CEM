import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { ScrollToHash } from "./components/layout/ScrollToHash";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <>
      <ScrollToHash />

      <Header />

      <AppRoutes />

      <Footer />
    </>
  );
}

export default App;