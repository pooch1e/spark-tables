//get themes
import { ThemeService } from '@/app/lib/services/themeService';
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from '@/app/lib/services/errorHandling';
export async function GET(request: Request) {
  try {
    const allThemes = await ThemeService.getAllThemes();

    return Response.json(
      {
        success: true,
        data: allThemes,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err, 'error in fetching themes');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch themes',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return Response.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Validate name
    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    if (typeof body.name !== 'string') {
      return Response.json({ error: 'Name must be a string' }, { status: 400 });
    }

    if (body.name.trim() === '') {
      return Response.json({ error: 'Name cannot be empty' }, { status: 400 });
    }

    // Validate order
    if (body.order === undefined || body.order === null) {
      return Response.json({ error: 'Order is required' }, { status: 400 });
    }

    if (typeof body.order !== 'number') {
      return Response.json(
        { error: 'Order must be a number' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(body.order)) {
      return Response.json(
        { error: 'Order must be an integer' },
        { status: 400 }
      );
    }

    if (body.order < 1) {
      return Response.json(
        { error: 'Order must be a positive integer' },
        { status: 400 }
      );
    }

    // Validate topic_id
    if (body.topic_id === undefined || body.topic_id === null) {
      return Response.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    if (typeof body.topic_id !== 'number') {
      return Response.json(
        { error: 'Topic ID must be a number' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(body.topic_id)) {
      return Response.json(
        { error: 'Topic ID must be an integer' },
        { status: 400 }
      );
    }

    if (body.topic_id < 1) {
      return Response.json(
        { error: 'Topic ID must be a positive integer' },
        { status: 400 }
      );
    }

    const postedTheme = await ThemeService.postTheme({ body });
    return Response.json(
      {
        success: true,
        data: postedTheme,
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
    if (err instanceof DatabaseError) {
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
