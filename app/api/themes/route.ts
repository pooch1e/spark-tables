//get themes
import { ThemeService } from '@/app/lib/services/themeService';
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

    if (
      !body.name ||
      typeof body.name !== 'string' ||
      body.name.trim() === '' ||
      !body.order ||
      typeof body.order !== 'number' ||
      !body.topic_id ||
      typeof body.topic_id !== 'number'
    ) {
      return Response.json(
        { error: 'Theme must contain name, order and topic_id' },
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
    console.log(err, 'error in fetching topics');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to post theme',
      },
      { status: 400 }
    );
  }
}
