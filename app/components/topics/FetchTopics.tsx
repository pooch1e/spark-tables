import { TopicService } from '@/app/lib/services/topicService';
import Link from 'next/link';

export default async function TopicsTable() {
  const topics = await TopicService.getAllTopics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/${topic.name.toLowerCase()}`}
          className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 mb-2">
            {topic.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {topic.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
