import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import BaseActivityService from '../activity.service';
import { BaseActivitiesConstants } from '../constants';

chai.use(promised);

describe('GET baseActivity by unique fields', async () => {

    const papiService = new MockApiService();

    const request: Request = {
        method: 'GET',
        body: {},
        header: {},
        query:{}
    }

    it('Passing a Key should call getBaseActivityByKey with the key', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'Key',
            value: 'myKey'
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);
        papiService.getBaseActivityByKey = async (key: string) => {
            expect(key).to.equal(requestCopy.query.value);

            //Don't care...
            return [];
        }

        await baseActivityService.getBaseActivityByUniqueField();
        
    });

    it('should throw a "The request query must contain a unique_field parameter." exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            value: 'myKey'
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);
        papiService.getBaseActivityByKey = async (key: string) => {
            throw new Error();
        }

        await expect(baseActivityService.getBaseActivityByUniqueField()).to.be.rejectedWith(`The request query must contain a unique_field parameter.`);
        
    });

    it('should throw a "The request query must contain a value parameter." exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'Key'
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);

        await expect(baseActivityService.getBaseActivityByUniqueField()).to.be.rejectedWith(`The request query must contain a value parameter.`);
        
    });

    it('should throw a "The unique_field parameter must be one of the following" exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'UNSUPPORTED',
            value: "don't care..."
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);

        await expect(baseActivityService.getBaseActivityByUniqueField()).to.be.rejectedWith(`The unique_field parameter must be one of the following: '${BaseActivitiesConstants.UNIQUE_FIELDS.join(', ')}'.`);
        
    });
});
