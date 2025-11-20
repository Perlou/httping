import "./App.css";
import { Layout } from "./components/Layout";
import { HistorySidebar } from "./components/HistorySidebar";
import { RequestPanel } from "./components/RequestPanel";
import { ResponsePanel } from "./components/ResponsePanel";

function App() {
  return (
    <Layout>
      <HistorySidebar />
      <RequestPanel />
      <ResponsePanel />
    </Layout>
  );
}

export default App;
