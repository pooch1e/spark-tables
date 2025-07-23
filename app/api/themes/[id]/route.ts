import { ThemeService } from '@/app/lib/services/themeService';
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from '@/app/lib/services/errorHandling';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);

    if (isNaN(numericId) || numericId < 0) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const themeById = await ThemeService.getThemeById(numericId);

    return Response.json(
      {
        success: true,
        data: themeById,
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
    } else {
      return Response.json(
        { error: 'Internal Database Failure' },
        { status: 500 }
      );
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
          error: 'Invalid theme ID',
        },
        { status: 400 }
      );
    }
    await ThemeService.deleteThemeById(numericId);

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err, 'error in deleting Theme');
    return Response.json(
      {
        success: false,
        error: 'Failed to delete Theme',
      },
      { status: 400 }
    );
  }
}
