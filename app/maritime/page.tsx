import { TopicService } from '../lib/services/topicService';
import SparkTable from '../components/SparkTableComp/SparkTable';
export default async function MaritimePage() {
  const maritimeData = await TopicService.getAllTopicsDataById(4);
  // console.log(dungeonData);
  return (
    <div>
      <SparkTable data={maritimeData} />
    </div>
  );
}
