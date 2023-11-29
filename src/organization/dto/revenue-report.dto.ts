import { Field, InputType, ID } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested,  } from 'class-validator';



@InputType()
export class RevenueReportDTO {
    @IsNotEmpty()
    @Field({ nullable: true })
    org_id: number;

    @IsNotEmpty()
    @Field({ nullable: true })
    project_id: number;

    @IsNotEmpty()
    @Field({ nullable: true })
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    @Field({ nullable: true })
    amount: number; 

}

@InputType()
export class RevenueDataDTO {
    @IsNotEmpty()
    @Field({ nullable: true })
    org_id: number;

    @IsNotEmpty()
    @Field({ nullable: true })
    project_id: number;
}
