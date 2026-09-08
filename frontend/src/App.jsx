import { ScrollToHash } from "./components/layout/ScrollToHash";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <>
      <ScrollToHash />

      <AppRoutes />
    </>
  );
}

export default App;