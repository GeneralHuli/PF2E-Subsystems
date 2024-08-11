import { BasePF2eSub } from "../base-subsystem.js"

export class ChasePF2eSub extends BasePF2eSub {
    constructor(party, object, ...options) {
        object = foundry.utils.mergeObject(object, {
            title: "New Chase Activity",
            subType: "chasesubs",
        }, {overwrite: false});
        super(party, object, options);
    }
}