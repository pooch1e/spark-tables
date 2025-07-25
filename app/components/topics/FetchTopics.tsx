import { TopicService } from '@/app/lib/services/topicService';

export default async function TopicsTable() {
  const topics = await TopicService.getAllTopics();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {topics.map((topic) => (
            <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {topic.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {topic.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
