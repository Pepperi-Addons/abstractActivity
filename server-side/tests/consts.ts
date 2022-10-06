import { FindOptions } from "@pepperi-addons/papi-sdk";
import IApiService from "../iApiService";
import { BaseActivity } from "../types";

export class MockApiService implements IApiService
{
    async getBaseActivities(findOptions: FindOptions): Promise<BaseActivity[]> {
        return Promise.resolve([{}]);
    }
    
    async getBaseActivityByKey(key: string): Promise<BaseActivity> {
        return Promise.resolve({});
    }

    async getBaseActivityByUniqueField(unique_field: string, value: any): Promise<BaseActivity[]> {
        return Promise.resolve([{}]);
    }

    async postBaseActivity(body: BaseActivity): Promise<BaseActivity> {
        return Promise.resolve({});
    }
}
