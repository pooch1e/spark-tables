//get topics
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
