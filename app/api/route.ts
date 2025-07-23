import { Endpoints } from '../lib/services/endpointsService';

//endpoint.json
export async function GET(request: Request) {
  try {
    const endpoints = await Endpoints.getAllEndpoints();
    return Response.json({ success: true, data: endpoints });
  } catch (err) {
    console.log(err, 'err in serving full fetch');
    return Response.json({ success: false }, { status: 500 });
  }
}
