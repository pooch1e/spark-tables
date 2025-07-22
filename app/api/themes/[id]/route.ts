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
