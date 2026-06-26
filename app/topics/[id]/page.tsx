import SparkTable from '../../components/SparkTableComp/SparkTable';
import { TopicService } from '../../lib/services/topicService';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await TopicService.getAllTopicsDataById(Number(id));
  return (
    <div>
      <SparkTable data={data} />
    </div>
  );
}
