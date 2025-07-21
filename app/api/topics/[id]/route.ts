//get topics

import { TopicService } from '@/app/lib/services/topicService';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);
    const topicById = await TopicService.getTopicByTopicId(numericId);

    return Response.json(
      {
        success: true,
        data: topicById,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err, 'error in fetching topic');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch topics',
      },
      { status: 500 }
    );
  }
}
