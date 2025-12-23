import MockDataTest from "./components/mock-data-test";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="bg-background text-foreground">
        <div className="p-4">
          <MockDataTest />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
