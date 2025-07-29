import { TopicService } from '@/app/lib/services/topicService';
import Link from 'next/link';

export default async function TopicsTable() {
  const topics = await TopicService.getAllTopics();

  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <div key={topic.id}>
          <div className="grid grid-cols-2 gap-4 border-1 p-2 text-center">
            <Link href={`/${topic.name.toLowerCase()}`}>{topic.name}</Link>
            <p>{topic.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
