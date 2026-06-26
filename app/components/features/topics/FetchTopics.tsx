import { TopicService } from '@/app/lib/services/topicService';
import Link from 'next/link';

export default async function TopicsTable() {
  const topics = await TopicService.getAllTopics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-forge-border border border-forge-border m-4">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/topics/${topic.id}`}
          className="group bg-forge-surface p-6 hover:bg-forge-elevated transition-colors duration-150">
          <h3 className="font-[family-name:var(--font-cinzel)] text-forge-text text-base uppercase tracking-widest group-hover:text-forge-gold mb-3 transition-colors">
            {topic.name}
          </h3>
          <p className="font-mono text-forge-muted text-xs leading-relaxed">
            {topic.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
