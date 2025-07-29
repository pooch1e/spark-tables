import SparkTable from '../components/SparkTableComp/SparkTable';
import { TopicService } from '../lib/services/topicService';
export default async function CivilsationPage() {
  const civDataTable = await TopicService.getAllTopicsDataById(2);

  return (
    <div>
      <SparkTable data={civDataTable} />
    </div>
  );
}
