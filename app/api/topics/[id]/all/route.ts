import { TopicService } from '@/app/lib/services/topicService';
import {
  ConflictError,
  ValidationError,
  NotFoundError,
} from '@/app/lib/services/errorHandling';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);
    // validate id
    if (isNaN(numericId)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid topic ID',
        },
        { status: 400 }
      );
    }
    const allTopicsData = await TopicService.getAllTopicsDataById(numericId);
    if (!allTopicsData) {
      return Response.json(
        {
          success: false,
          error: 'Topic was not found',
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        data: allTopicsData,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    if (err instanceof ConflictError) {
      return Response.json(
        {
          success: false,
          error: err.message,
        },
        { status: 409 }
      );
    } else if (err instanceof NotFoundError) {
      throw err;
    } else if (err instanceof ValidationError) {
      throw err;
    } else {
      return Response.json(
        { success: false, error: 'Failed to fetch nested topic data' },
        { status: 500 }
      );
    }
  }
}
