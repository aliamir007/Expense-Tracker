import Navbar from './Navbar';
import SummaryCards from './SummaryCards';
import ProgressBar from './ProgressBar';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Breakdown from './Breakdown';
import SmartTip from './SmartTip';

export default function Dashboard() {
  return (
    <div id="screen-dashboard" className="screen active">
      <Navbar />
      <main className="dashboard">
        <SummaryCards />
        <ProgressBar />
        <div className="two-col">
          <div className="col-left">
            <TransactionForm />
            <TransactionList />
          </div>
          <div className="col-right">
            <Breakdown />
            <SmartTip />
          </div>
        </div>
      </main>
    </div>
  );
}
