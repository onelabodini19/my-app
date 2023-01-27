
import './App.css';
import InterviewerGrid from './components/InterviewerGrid';
import {
QueryClientProvider, QueryClient} from 'react-query';


const queryClient=new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <InterviewerGrid />
    </QueryClientProvider>
  
  );

}

export default App;
