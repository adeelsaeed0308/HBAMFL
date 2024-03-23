import {
  hbaFav,
  isKanda,
  kandaFav,
  LoginProvider,
  ModalProvider,
  ThemeProvider,
} from "common";
import { ToastProvider } from "common/context/Toast";
import { Body, Header } from "containers";
import ErrorBoundary from "ErrorBoundary";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";

const head = document.querySelector("head");
const fav = document.createElement("link");
fav.rel = "icon";
fav.href = isKanda() ? kandaFav : hbaFav;
head.appendChild(fav);
document.title = isKanda() ? "K&A" : "Work Portal";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <LoginProvider>
            <ModalProvider>
              <Header />
              <ErrorBoundary>
                <Body>
                  <Routes />
                </Body>
              </ErrorBoundary>
            </ModalProvider>
          </LoginProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
