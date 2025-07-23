import { ThemeService } from '@/app/lib/services/themeService';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const topicId: string = await params.id;
    const numericId: number = Number(topicId);

    const themesByTopicId = await ThemeService.getThemesByTopicId(numericId);

    return Response.json(
      { success: true, data: themesByTopicId },
      { status: 200 }
    );
  } catch (err) {
    console.error(err, 'error in fetching themes by topic id');
    return Response.json(
      { success: false, error: 'Failed to fetch themes for topic' },
      { status: 500 }
    );
  }
}
