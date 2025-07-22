import { ThemeService } from '@/app/lib/services/themeService';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);
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
    console.log(err, 'error in fetching theme by id');
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch theme by id',
      },
      { status: 500 }
    );
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
