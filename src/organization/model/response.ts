import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Response {
  @Field(() => Int)
  status: number;

  @Field(() => String)
  message: string;

}