import { Field, InputType, ID } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested,  } from 'class-validator';

@InputType()
export class BudgetReportDTO {
    @IsNotEmpty()
    @Field({ nullable: true })
    org_id: number;

    @IsNotEmpty()
    @Field({ nullable: true })
    project_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Field({ nullable: true })
    amount: number; 

    @IsNotEmpty()
    @Field({ nullable: true })
    date: Date;

}
