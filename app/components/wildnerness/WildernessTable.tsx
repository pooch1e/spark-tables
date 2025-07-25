import { TopicService } from '@/app/lib/services/topicService';
export default async function WildernessTable() {
  const topics = await TopicService.getAllTopicsDataById(1);
  const wilderness = topics[0];
  return (
    <div>
      <p>{wilderness.name}</p>
      <p>{wilderness.description}</p>
      <div>
        {wilderness.themes.map((theme) => {
          return (
            <div key={theme.id}>
              <p>{theme.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
