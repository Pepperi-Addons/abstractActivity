import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import BaseActivityService from '../activity.service';

chai.use(promised);

describe('GET baseActivity by key', async () => {


    const papiService = new MockApiService();

    const request: Request = {
        method: 'GET',
        body: {},
        header: {},
        query:{}
    }

    it('should call getBaseActivityByKey with a key', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            key:'myKey'
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);
        papiService.getBaseActivityByKey = async (key: string) => {
            expect(key).to.equal(requestCopy.query.key);

            //Don't care...
            return [];
        }

        await baseActivityService.getBaseActivityByKey();
        
    });

    it('should throw a "Could not find a baseActivity with requested key" exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            key:'myKey'
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);
        papiService.getBaseActivityByKey = async (key: string) => {
            throw new Error();
        }

        await expect(baseActivityService.getBaseActivityByKey()).to.be.rejectedWith(`Could not find a baseActivity with requested key '${requestCopy.query.key}'`);
        
    });

    it('should throw a "The request query must contain a key parameter." exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {}
        const baseActivityService = new BaseActivityService(requestCopy, papiService);

        await expect(baseActivityService.getBaseActivityByKey()).to.be.rejectedWith(`The request query must contain a key parameter.`);
        
    });
});
