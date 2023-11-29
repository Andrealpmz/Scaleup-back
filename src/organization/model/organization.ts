import { ObjectType, Field, ID, Int } from '@nestjs/graphql'

@ObjectType()
export class Organization {
    @Field({ nullable: true })
    nit: string;

    @Field({ nullable: true })
    logo?: string;

    @Field({ nullable: true })
    type: string;

    @Field({ nullable: true })
    name: string;

    @Field({nullable: true})
    country: string;

    @Field({nullable: true})
    city: string;

    @Field({ nullable: true })
    website?: string;
}