import { MotionConfig } from "motion/react";

import { ScrollToHash } from "./components/layout/ScrollToHash";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    // reducedMotion="user": quem ativou "reduzir movimento" no sistema vê o site sem deslocamentos animados.
    <MotionConfig reducedMotion="user">
      <ScrollToHash />

      <AppRoutes />
    </MotionConfig>
  );
}

export default App;