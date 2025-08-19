import RandomNumberButton from './components/RandomNumberButton';
import TopicsTable from './components/topics/FetchTopics';
import { ThreeCanvas } from './World/ThreeCanvas';

export default function Home() {
  return (
    <>
      <div className="topic">
        <TopicsTable />
        <RandomNumberButton />
        <ThreeCanvas />
      </div>
    </>
  );
}
