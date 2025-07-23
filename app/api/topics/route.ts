//get topics
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from '@/app/lib/services/errorHandling';
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
    const keys = Object.keys(body);
    if (keys.length === 0) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
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
        error: 'Failed to post topic',
      },
      { status: 400 }
    );
  }
}
