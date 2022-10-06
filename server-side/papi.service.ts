import { Client } from '@pepperi-addons/debug-server/dist';
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import { AbstractActivitiesConstants } from './constants';
import IApiService from './iApiService';
import { BaseActivity } from './types';

export class PapiService implements IApiService
{
	constructor(protected papiClient: PapiClient, protected client: Client) 
	{}

	async getBaseActivities(findOptions: FindOptions): Promise<Array<BaseActivity>>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(AbstractActivitiesConstants.SCHEMA_NAME).find(findOptions);
	}

	async getBaseActivityByKey(key: any): Promise<BaseActivity>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(AbstractActivitiesConstants.SCHEMA_NAME).key(key).get();
	}

	/**
     * Returns an *array* of baseActivities. It is up to the user to validate the response length.
     * @param unique_field The unique field to use for the search
     * @param value The value to search for
     * @returns An *array* of baseActivities that match the search
     */
	async getBaseActivityByUniqueField(unique_field: string, value: any): Promise<Array<BaseActivity>>
	{
		const findOptions: FindOptions = 
        {
        	where: `${unique_field} = '${value}'`,
        }
        
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(AbstractActivitiesConstants.SCHEMA_NAME).find(findOptions);
	}

	postBaseActivity(body: BaseActivity): Promise<BaseActivity>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(AbstractActivitiesConstants.SCHEMA_NAME).upsert(body);
	}
}

export default PapiService;