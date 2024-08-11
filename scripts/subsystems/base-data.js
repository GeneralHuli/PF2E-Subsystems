export class BasePF2eSubModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            title: new fields.StringField({ required: true, nullable: false, initial: "New" }),
            endPoint: new fields.NumberField({ required: false, positive: true, integer: true }),
            startPoint: new fields.NumberField({ required: false, positive: true, integer: true }),
            rewards: new fields.ArrayField( new fields.ObjectField({ required: false, nullable: false }), {
                required: true,
                nullable: false,
            }),
            thresholds: new fields.ArrayField( new fields.NumberField({ required: false, integer: true }), {
                required: true,
                nullable: false,
            }),
            success: new fields.ArrayField( new fields.NumberField({ required: false, integer: true }), {
                required: true,
                nullable: false,
            }),
            combined: new fields.BooleanField(),
            teams: new fields.ArrayField( new fields.ObjectField({ required: false, nullable: false }), {
                required: true,
                nullable: false,
            }),
            automatic: new fields.NumberField({ required: true, min: 0, integer: true, initial: 0 }),
            obstacles: new fields.ArrayField( new fields.ObjectField({ required: false, nullable: false }), {
                required: true,
                nullable: false,
            }),
            turnBased: new fields.BooleanField(),
            id: new fields.StringField({ required: true, nullable: false, initial: "" }),
            subType: new fields.StringField({ required: true, nullable: false }),
            party: new fields.ObjectField({ required: true, nullable: false }),
        }
    }
}