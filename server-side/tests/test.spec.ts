import { Request } from "@pepperi-addons/debug-server";


import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PapiClient } from "@pepperi-addons/papi-sdk";

chai.use(promised);

describe('Provide a reference to tests', async () => {
    const request: Request = {
        method: 'POST',
        body: {},
        header: {},
        query:
        {
            addon_uuid: '00000000-0000-0000-0000-000000000000',
        }
    }


    it('should succeed', async () => {
        const x = "Great success";

        expect(x).to.be.a('string');
        expect(x).to.equal("Great success");
    })
});