export class BasePF2eSub extends FormApplication {
    type = 'pf2e-subsystem'

    constructor(party, object, ...options) {
        super(object, options);
        this.party = party;
        this.object = foundry.utils.mergeObject(this.object, {
            title: "New Activity",
            endPoint: 20,
            points: 0,
            rewards: {},
            success: [2,1,0,-1],
            combined: true,
            teams: party ? {"party": party.members} : {},
            automatic: 0,
            obstacles: [],
            turnBased: true,
            id: foundry.utils.randomID(),
            subType: "custom",
            description: "",
        }, {overwrite: false});
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: 'Edit Subsystem',
            id: 'subsystems-configure',
            classes: ['pf2e-subsystem', 'sheet', 'pf2e', 'action', 'item'],
            template: "modules/pf2e-subsystems/templates/edit-subsystem.hbs",
            width: 775,
            height: 500,
            closeOnSubmit: false,
            submitOnChange: true,
            resizable: true,
            tabs: [
                {
                    navSelector: ".tabs",
                    contentSelector: ".sheet-body",
                    initial: "description",
                },
            ],
            hasSidebar: false,
        });
    }

    async getData(options = {}) {
        //options = foundry.utils.mergeObject(this.options, {title: this.object.title});
        const data = super.getData(options);
        data.title = this.object.title;

        const enrichedContent = {};
        enrichedContent.description = await TextEditor.enrichHTML(this.object.description)

        return {
            ...data,
            enrichedContent: enrichedContent,
            owner: game.user.isGM,
            editable: true,
        };
    }


    activateListeners($html) {
        super.activateListeners($html);

        for (const button of $html.find("a.remove-reward")) {
            button.addEventListener("click", async () => {
                await this.removeReward(button.dataset.id)
            });
        }

        const addReward = $html.find("[data-action=add-reward]")
        addReward[0].addEventListener("click", async () => {
            await this.addReward()
        });

        const rewards = $html.find(".rewards-forms");
        if (rewards) {
            Sortable.create(rewards[0], {
                handle: ".drag-handle",
                animation: 200,
                direction: "vertical",
                dragClass: "drag-preview",
                dragoverBubble: true,
                easing: "cubic-bezier(1, 0, 0, 1)",
                fallbackOnBody: true,
                filter: "div.item-summary",
                ghostClass: "drag-gap",
                group: "inventory",
                preventOnFilter: false,
                swapThreshold: 0.25,
            
                // These options are from the Autoscroll plugin and serve as a fallback on mobile/safari/ie/edge
                // Other browsers use the native implementation
                scroll: true,
                scrollSensitivity: 30,
                scrollSpeed: 15,
            
                delay: 500,
                delayOnTouchOnly: true,
            });
        }
    }

    _configureProseMirrorPlugins(name, options = {}) {
        const plugins = super._configureProseMirrorPlugins(name, options);
        plugins.menu = foundry.prosemirror.ProseMirrorMenu.build(foundry.prosemirror.defaultSchema, {
            destroyOnSave: options.remove,
            onSave: () => this.saveEditor(name, options),
            compact: this.options.hasSidebar,
        });
        return plugins;
    }

    async _updateObject(_event, formData) {
        console.log("event",_event)
        console.log("formdata", formData)

        for(let [name, value] of Object.entries(formData)) {
            name = name.split(".");
            switch (name.length) {
                case 1:
                    this.object[name[0]] = value;
                    break;
                case 2:
                    this.object[name[0]][name[1]] = value;
                    break;
                case 3:
                    this.object[name[0]][name[1]][name[2]] = value;
                    break;
                case 4:
                    this.object[name[0]][name[1]][name[2]][name[3]] = value;
                    break;
            }
        }
        
        console.log("updateObject")
        await this.party.subsystems.updateData(foundry.utils.deepClone(this.object))
    }

    async addReward() {
        let reward = {
            id: foundry.utils.randomID(),
            rank: 0,
            xp: 100,
            items: [],
            notes: "",
            treasure: {
                cp: 0,
                sp: 0,
                gp: 0,
                pp: 0,
            }
        }
        this.object.rewards[reward.id] = reward;

        await this.party.subsystems.updateData(foundry.utils.deepClone(this.object))

        this.render();
    }

    async removeReward(id) {
        let title = this.object.rewards[id].title;

        Dialog.confirm({
            title: `Delete Reward: ${title}`,
            content: `<h4>Are You Sure?</h4><p>This Reward will be permanently deleted and cannot be recovered.</p>`,
            yes: async () => {
                delete this.object.rewards[id];
                await this.party.subsystems.deleteData(foundry.utils.deepClone(this.object), `rewards.${id}`);
                this.render();
            },
            no: () => { return; },
        });
    }
}