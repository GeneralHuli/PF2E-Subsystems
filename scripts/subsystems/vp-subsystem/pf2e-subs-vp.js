import { BasePF2eSub } from "../base-subsystem.js"

export class VPPF2eSub extends BasePF2eSub{
    constructor(party, object, ...options) {
        object = foundry.utils.mergeObject(object, {
            title: "New Victory Points Activity",
            subType: "vpsubs",
        }, {overwrite: false});
        super(party, object, options);
        
    }
    
}

