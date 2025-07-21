//get topics

import { TopicService } from '@/app/lib/services/topicService';
export async function GET(request: Request) {
  try {
    const allTopics = await TopicService.getAllTopics();

    return Response.json(
      {
        success: true,
        data: allTopics,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err, 'error in fetching topics');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch topics',
      },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const postedTopic = await TopicService.postTopic({ body });
    return Response.json(
      {
        success: true,
        data: postedTopic,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log(err, 'error in fetching topics');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to update topics',
      },
      { status: 400 }
    );
  }
}
