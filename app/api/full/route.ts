import { TopicService } from '@/app/lib/services/topicService';

export async function GET(request: Request) {
  try {
    const allData = await TopicService.getAllTopicsData();
    return Response.json(
      {
        success: true,
        data: allData,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err, 'error in fetching data');
    //add proper error handling
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch data',
      },
      { status: 400 }
    );
  }
}
