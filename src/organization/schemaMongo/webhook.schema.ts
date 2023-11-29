// import * as mongoose from 'mongoose';

// export const CatSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   breed: String,
// });

// import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as schemaMongoose } from "mongoose";

export type WebhookDocument = Webhook & Document;

@Schema()
export class Webhook {
    @Prop({
        type: String,
    })
    webhook_event: string;

    @Prop({
        type: String,
    })
    account_id: string;

    @Prop({
        type: String,
    })
    user_name: string;

    @Prop({
        type: Number,
    })
    issue_id: number;

    @Prop({
        type: String,
    })
    issue_key: string;

    @Prop({
        type: String,
    })
    issue_summary: string;

    @Prop({
        type: String,
    })
    issue_type: string;

    @Prop({
        type: String,
    })
    changeover_date: string;

    @Prop({
        type: String,
    })
    status: string;

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

export const WebhookSchema = SchemaFactory.createForClass(Webhook);