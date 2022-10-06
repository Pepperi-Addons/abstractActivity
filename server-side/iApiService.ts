import { FindOptions } from '@pepperi-addons/papi-sdk';
import { BaseActivity } from './types';

export interface IApiService 
{
	getBaseActivities(findOptions: FindOptions): Promise<Array<BaseActivity>>;

	getBaseActivityByKey(key: string): Promise<BaseActivity>;

    /**
     * Returns an *array* of baseActivities. It is up to the user to validate the response length.
     * @param unique_field The unique field to use for the search
     * @param value The value to search for
     * @returns An *array* of baseActivities that match the search
     */
    getBaseActivityByUniqueField(unique_field: string, value: any): Promise<Array<BaseActivity>>;

    postBaseActivity(body: BaseActivity): Promise<BaseActivity>;
}

export default IApiService;