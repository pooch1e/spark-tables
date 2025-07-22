import { TopicService } from '@/app/lib/services/topicService';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId: number = Number(id);
    const allTopicsData = await TopicService.getAllTopicsData(numericId);
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
    console.log(err, 'error fetching topics nested data');
    return Response.json(
      {
        success: false,
      },
      { status: 400 }
    );
  }
}
