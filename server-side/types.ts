import { AddonData } from "@pepperi-addons/papi-sdk";

export interface BaseActivity extends AddonData{

    // Generated UUID
    Key?: string;

    StatusName?: string;

    ActionDateTime?: string;

    Account?: string;

    Creator?: string;

    Agent?: string;

}