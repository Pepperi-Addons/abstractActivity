import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import BaseActivityService from '../activity.service';
import { BaseActivity } from '../types';

chai.use(promised);

describe('POST baseActivity', async () => {

    const request: Request = {
        method: 'POST',
        body: {},
        header: {},
        query:{}
    }

    it('create a new baseActivity', async () => {

        const requestCopy = { ...request };
        const papiService = new MockApiService();

        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const baseActivityService = new BaseActivityService(requestCopy, papiService);
        
        
        papiService.postBaseActivity = async (body: BaseActivity) => {
            expect(body.Key).to.equal(requestCopy.body.Key);
            expect(body.Creator).to.equal(requestCopy.body.Creator);
            // Don't care...
            return {};
        }

        await baseActivityService.postBaseActivity();
        
    });

    it('should throw a "The request body must contain a Key parameter." exception', async () => {

        
        const requestCopy = { ...request };
        requestCopy.body = {
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new MockApiService();

        const baseActivityService = new BaseActivityService(requestCopy, papiService);

        await expect(baseActivityService.postBaseActivity()).to.be.rejectedWith(`The request body must contain a Key parameter.`);
        
    });

    it('should throw a "creator and template fields are mandatory on creation" exception', async () => {

        const requestCopy = { ...request };
        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new MockApiService();
        const baseActivityService = new BaseActivityService(requestCopy, papiService);

        // postBaseActivity uses getBaseActivityByKey to check if a baseActivity exists.
        // If no Creator is provided and the baseActivity doesn't exist, it should throw an error.
        baseActivityService.getBaseActivityByKey = async (key: string) => {
            return Promise.reject();
        }

        await expect(baseActivityService.postBaseActivity()).to.be.rejectedWith(`The baseActivity with key '${requestCopy.body.Key}' does not exist. The Creator and Account fields are mandatory on creation.`);
        
    });
});
