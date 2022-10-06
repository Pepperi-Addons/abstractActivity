import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Request } from '@pepperi-addons/debug-server';
import { AbstractActivitiesConstants } from './constants';
import { BaseActivity } from './types';
import IApiService from './iApiService';

export class BaseActivityService 
{
	
	constructor(private request: Request, private iApiService: IApiService)
	{

	}

	/**
     * Get baseActivities
     * @returns An array of baseActivities
     */
	 getBaseActivities(): Promise<Array<BaseActivity>>
	{
		const findOptions: FindOptions = this.buildFindOptionsFromRequestQuery();

		return this.iApiService.getBaseActivities(findOptions);
	}

	/**
     * Build a FindOptions object from the request query
     * @returns FindOptions object from request query
     */
	private buildFindOptionsFromRequestQuery(): FindOptions
	{
		return {
			...(this.request.query.fields && {fields: this.request.query.fields.split(',')}),
			...(this.request.query.where && {where: this.request.query.where}),
			...(this.request.query.order_by && {order_by: this.request.query.order_by}),
			...(this.request.query.page && {page: this.request.query.page}),
			...(this.request.query.page_size && {page_size: this.request.query.page_size}),
			...(this.request.query.include_deleted && {include_deleted: this.request.query.include_deleted}),
		};
	}

	/**
     * 
     * @returns A baseActivity by key
     */
	async getBaseActivityByKey(key?: string)
	{
		const requestedKey = key ?? this.request.query.key;
		this.validateGetBaseActivitiesByKeyRequest(requestedKey);

		let baseActivity: BaseActivity = {};
		try
		{
			baseActivity = await this.iApiService.getBaseActivityByKey(requestedKey);
		}
		catch(papiError)
		{
			if(papiError instanceof Error)
			{
				console.log(papiError);
				const error :any = new Error(`Could not find a baseActivity with requested key '${requestedKey}'`);
				error.code = 404;

				throw error;
			}
		}
		return baseActivity;
	}

	/**
     * Validate the request query for getBaseActivityByKey
     */
	validateGetBaseActivitiesByKeyRequest(key: string)
	{
		if(!key)
		{
			const errorMessage = `The request query must contain a key parameter.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	/**
     * 
     * @returns A baseActivity by unique field
     */
	async getBaseActivityByUniqueField(): Promise<BaseActivity>
	{
		this.validateGetBaseActivityByUniqueFieldRequest();

		if(this.request.query.unique_field === 'Key')
		{
			return this.getBaseActivityByKey(this.request.query.value);
		}
		else
		{
			const res: Array<BaseActivity> = await this.iApiService.getBaseActivityByUniqueField(this.request.query.unique_field, this.request.query.value);
            
			this.validateGetByUniqueFieldResult(res);

			return res[0];
		}
	}

	/**
     * Throws an exception in case the number of results is not 1.
     * @param res the list of results to validate
     */
	private validateGetByUniqueFieldResult(res: BaseActivity[])
	{
		if (res.length === 0) 
		{
			const errorMessage = `Could not find a baseActivity with unique_field: '${this.request.query.unique_field}' and value '${this.request.query.value}'`;
			console.error(errorMessage);
			const error: any = new Error(errorMessage);
			error.code = 404;
			throw error;
		}

		if (res.length > 1) 
		{
			// Something super strange happened...
			const errorMessage = `Found more than one baseActivity with unique_field: '${this.request.query.unique_field}' and value '${this.request.query.value}'`;
			console.error(errorMessage);
			const error: any = new Error(errorMessage);
			error.code = 404;
			throw error;
		}
	}

	/**
     * Validate the request query for getBaseActivityByUniqueField 
     */
	validateGetBaseActivityByUniqueFieldRequest()
	{
		if(!this.request.query.unique_field)
		{
			const errorMessage = `The request query must contain a unique_field parameter.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		if(!this.request.query.value)
		{
			const errorMessage = `The request query must contain a value parameter.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		if(!AbstractActivitiesConstants.UNIQUE_FIELDS.includes(this.request.query.unique_field))
		{
			const errorMessage = `The unique_field parameter must be one of the following: '${AbstractActivitiesConstants.UNIQUE_FIELDS.join(', ')}'.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
             
	async postBaseActivity()
	{
		await this.validatePostMandatoryFields();
		return await this.iApiService.postBaseActivity(this.request.body);
	}

	/**
     * throws an error if mandatory fields are missing from the request body
     */
	async validatePostMandatoryFields()
	{
		if(!this.request.body.Key)
		{
			const errorMessage = `The request body must contain a Key parameter.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		if(!this.request.body.Creator || !this.request.body.Account)
		{
			// Creator field is mandatory on creation. Ensure a baseActivity exists, else throw an error.
			try
			{
				await this.getBaseActivityByKey(this.request.body.Key);
			}
			catch(error)
			{
				// BaseActivity not found and creator field is mandatory. Throw an error.
				const errorMessage = `The baseActivity with key '${this.request.body.Key}' does not exist. The Creator and Account fields are mandatory on creation.`;
				console.error(errorMessage);
				throw new Error(errorMessage);
			}
		}
	}
}

export default BaseActivityService;
