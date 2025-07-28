import SparkTable from '../components/SparkTableComp/SparkTable';
import { TopicService } from '../lib/services/topicService';

export default async function WildernessPage() {
  const wildernessTableData = await TopicService.getAllTopicsDataById(1);
  // console.log(wildernessTableData, 'logging in wildneress page');
  return (
    <div>
      {/* Will pass down wilderness data as props */}
      <SparkTable data={wildernessTableData} />
    </div>
  );
}
