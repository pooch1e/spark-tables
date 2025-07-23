//get topics
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
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

    if (
      !body.name ||
      typeof body.name !== 'string' ||
      body.name.trim() === ''
    ) {
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
    if (err instanceof ConflictError) {
      return Response.json({ error: err.message }, { status: 409 });
    }

    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
  }
}
