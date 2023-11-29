import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Organization } from 'src/organization/model/organization';
// import { CreateUserDTO } from 'src/user/dto/create-user.dto';
// import { User } from 'src/user/model/user';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
// import { SignUpDTO } from './dto/sign-up-auth.dto';
import { MainSignUpDTO } from './dto/main-sign-up.dto';
import { Area } from './model/areas.model';


@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService){}

    // @Mutation(() => User)
    // async loginUser(@Args({name: 'input', type: () => LoginAuthDTO}) input: LoginAuthDTO) {
    //     return await this.authService.login(input)
    // }

    // @Mutation(() => User )
    // async generalLogin(@Args({name: 'input', type: () => LoginAuthDTO}) input: LoginAuthDTO) {
    //     return await this.authService.generalLogin(input)
    // }

    // @Mutation(() => User)
    // async signUpUser(@Args({name: 'input', type: () => SignUpDTO}) input: SignUpDTO) {
    //     return await this.authService.signUpUser(input)
    // }

    @Mutation(() => Organization)
    async mainSignUp(@Args({name: 'input', type: () => MainSignUpDTO}) input: MainSignUpDTO) {
        return await this.authService.mainSignUp(input)
    }

    @Query(() => [Area])
    async diagnosisTest() {
        return await this.authService.diagnosisTest()
    }
}
