import RandomNumberButton from './components/RandomNumberButton';
import TopicsTable from './components/topics/FetchTopics';

export default function Home() {
  return (
    <>
      <div className="topic">
        <TopicsTable />
        <RandomNumberButton />
      </div>
    </>
  );
}
