
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, errorMessage:{the reason why it is false}}
The error Message is important! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server';
import { AddonDataScheme, PapiClient, Relation } from '@pepperi-addons/papi-sdk';
import { BaseActivitiesConstants } from './constants';
import { Helper } from './helper';
import semverLessThanComparator from 'semver/functions/lt'

export async function install(client: Client, request: Request): Promise<any> 
{
	try
	{
		const papiClient = Helper.getPapiClient(client);

		await createAbstractActivitiesSchema(papiClient, client);
	
		await createDimxRelations(papiClient, client);
	}
	catch(error)
	{
		return { success: false, errorMessage: error instanceof Error ? error.message : 'Unknown error occurred.' };
	}

	return { success: true, resultObject: {} };
}

export async function uninstall(client: Client, request: Request): Promise<any> 
{
	const papiClient = Helper.getPapiClient(client);

	await removeDimxRelations(papiClient, client);

	return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> 
{
	// Upsert schema to have reference fields
	if (request.body.FromVersion && semverLessThanComparator(request.body.FromVersion, '0.0.5')) 
	{
		try
		{
			const papiClient = Helper.getPapiClient(client);
			await createAbstractActivitiesSchema(papiClient, client);
		}
		catch(error)
		{
			return { success: false, errorMessage: error instanceof Error ? error.message : 'Unknown error occurred.' };
		}
	}

	return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
}

async function createAbstractActivitiesSchema(papiClient: PapiClient, client: Client)
{
	const schema: AddonDataScheme = {
		Name: BaseActivitiesConstants.SCHEMA_NAME,
		Type: 'abstract',
		AddonUUID: client.AddonUUID,
		DataSourceData: {
			IndexName: BaseActivitiesConstants.DATA_SOURCE_INDEX_NAME
		},
		Fields:
        {
        	StatusName: 
            {
            	Type: 'String'
            },
        	ActionDateTime: 
            {
            	Type: 'DateTime'
            },
        	Account:
			{
				Type: "Resource",
				Resource: "accounts",
				AddonUUID: BaseActivitiesConstants.CORE_RESOURCES_ADDON_UUID
			},
        	Creator:
            {
            	Type: "Resource",
				Resource: "users",
				AddonUUID: BaseActivitiesConstants.CORE_RESOURCES_ADDON_UUID
            },
        	Agent:
            {
            	Type: "Resource",
				Resource: "users",
				AddonUUID: BaseActivitiesConstants.CORE_RESOURCES_ADDON_UUID
            },
			ExternalID:
			{
				Type: 'String'
			}
        }
	}

	await papiClient.addons.data.schemes.post(schema);
}

async function createDimxRelations(papiClient: PapiClient, client: Client)
{
	const isHidden = false;
	await postDimxRelations(papiClient, client, isHidden);
}

async function removeDimxRelations(papiClient: PapiClient, client: Client)
{
	const isHidden = true;
	await postDimxRelations(papiClient, client, isHidden);
}

async function postDimxRelations(papiClient: PapiClient, client: Client, isHidden: boolean) 
{

	const importRelation: Relation = {
		RelationName: "DataImportResource",
		AddonUUID: client.AddonUUID,
		AddonRelativeURL: '',
		Name: BaseActivitiesConstants.SCHEMA_NAME,
		Type: 'AddonAPI',
		Source: 'adal',
		Hidden: isHidden
	};

	const exportRelation: Relation = {
		RelationName: "DataExportResource",
		AddonUUID: client.AddonUUID,
		AddonRelativeURL: '',
		Name: BaseActivitiesConstants.SCHEMA_NAME,
		Type: 'AddonAPI',
		Source: 'adal',
		Hidden: isHidden
	};

	await upsertRelation(papiClient, importRelation);
	await upsertRelation(papiClient, exportRelation);
}

async function upsertRelation(papiClient: PapiClient, relation: Relation) 
{
	return papiClient.post('/addons/data/relations', relation);
}
