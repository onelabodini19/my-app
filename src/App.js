
import './App.css';
import Interviewer from './components/Interviewer';
import Candidate from './components/Candidate'
import {
  QueryClientProvider, QueryClient
} from 'react-query';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<Interviewer />} />
          <Route path="/candidate" element={<Candidate />} />
        </Routes>
      </Router>
    </QueryClientProvider>

  );

}

export default App;
