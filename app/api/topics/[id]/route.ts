//get topics/[id]
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from '@/app/lib/services/errorHandling';
import { TopicService } from '@/app/lib/services/topicService';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);

    if (isNaN(numericId) || numericId < 0) {
      return Response.json(
        {
          error: 'Invalid ID',
        },
        { status: 400 }
      );
    }
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
    if (err instanceof NotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    } else if (err instanceof ValidationError) {
      return Response.json(
        { error: err.message },
        {
          status: 404,
        }
      );
    } else if (err instanceof DatabaseError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
  }
}

export async function DELETE(
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
    await TopicService.deleteTopicById(numericId);

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err, 'error in deleting topic');
    return Response.json(
      {
        success: false,
        error: 'Failed to delete topics',
      },
      { status: 400 }
    );
  }
}

export async function PUT(
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
    const body = await request.json();
    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return Response.json(
        {
          success: false,
          error: 'Request body cannot be empty',
        },
        { status: 400 }
      );
    }
    const updatedTopic = await TopicService.updateTopicByTopicId(
      numericId,
      body
    );
    if (!updatedTopic) {
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
        data: updatedTopic,
      },
      { status: 200 }
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
      throw err;
    }
  }
}
