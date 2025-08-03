import SparkTable from '../components/SparkTableComp/SparkTable';
import { TopicService } from '../lib/services/topicService';
export default async function DungeonPage() {
  const dungeonData = await TopicService.getAllTopicsDataById(3);
  // console.log(dungeonData);

  return (
    <div>
      <SparkTable data={dungeonData} />
    </div>
  );
}
