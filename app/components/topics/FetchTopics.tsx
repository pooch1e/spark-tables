import { TopicService } from '@/app/lib/services/topicService';
import Link from 'next/link';

export default async function TopicsTable() {
  const topics = await TopicService.getAllTopics();

  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <div key={topic.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full p-2">
            <Link
              href={`/${topic.name.toLowerCase()}`}
              className="grid grid-cols-2 gap-4 border-1 p-2">
              {topic.name}
            </Link>
            <p className="grid grid-cols-2 gap-4 border-1 p-2">
              {topic.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
