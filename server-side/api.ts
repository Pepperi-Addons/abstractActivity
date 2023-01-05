import { Client, Request } from '@pepperi-addons/debug-server';
import { Helper } from './helper';
import PapiService from './papi.service';
import { BaseActivityService } from './activity.service';
import IApiService from './iApiService';

export async function base_activities(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseActivitiesService = getBaseActivitiesService(client, request);
		return baseActivitiesService.getBaseActivities();
	}
	case "POST":
	{
		const baseActivitiesService = getBaseActivitiesService(client, request);
		return baseActivitiesService.postBaseActivity();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function get_base_activities_by_key(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseActivitiesService = getBaseActivitiesService(client, request);
		return baseActivitiesService.getBaseActivityByKey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function get_base_activities_by_unique_field(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseActivitiesService = getBaseActivitiesService(client, request);
		return baseActivitiesService.getBaseActivityByUniqueField();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

function getBaseActivitiesService(client: Client, request: Request)
{
	const papiClient = Helper.getPapiClient(client);
	const papiService: IApiService = new PapiService(papiClient, client);
	const baseActivitiesService = new BaseActivityService(request, papiService);
	return baseActivitiesService;
}