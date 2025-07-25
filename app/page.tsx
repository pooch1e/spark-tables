import TopicsTable from './components/topics/FetchTopics';

export default function Home() {
  return (
    <>
      <h3 className="p-2.5">Homepage</h3>
      <div className="topic">
        <p>load topic table serv component</p>
        <TopicsTable />
      </div>
    </>
  );
}
