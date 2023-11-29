import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as schemaMongoose } from "mongoose";

export type RevenuesDocument = Revenues & Document;


type ReportObj = {
    date: Date;
    amount: number; 
}

@Schema()
export class Revenues {
    @Prop({
        type: Number,
    })
    org_id: number;

    @Prop({
        type: Number,
    })
    project_id: number

    @Prop({
        type: schemaMongoose.Types.Mixed,
    })
    revenue_reports: ReportObj[] ;

    @Prop({
        type: schemaMongoose.Types.Mixed,
    })
    budget_reports: ReportObj[] ;

    @Prop({
        type: Number,
    })
    budget?: number;

    @Prop({
        type: Date,
        required: true
    })
    created_at: Date;

    @Prop({
        type: Date,
    })
    updated_at: Date;
}

export const RevenuesSchema = SchemaFactory.createForClass(Revenues);