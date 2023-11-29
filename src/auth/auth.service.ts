import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
// import { SignUpDTO } from './dto/sign-up-auth.dto';
import { hash, compare } from 'bcrypt'
import { UserInputError } from 'apollo-server-express';
import { MainSignUpDTO } from './dto/main-sign-up.dto';
import { Organization } from 'src/organization/model/organization';


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService
        ){}

    async login(data: LoginAuthDTO){
        
        try{

            const { password, email } = data;

            const findUser = await this.prismaService.user.findUnique({
                where: { email }
            })

            if(findUser){

                const checkPassword = await compare(password, findUser.password)
    
                if(checkPassword){
                    const payload = { 
                        id: findUser.email,
                        // org_id: findUser.org_id
                        // org_id: findUser.org_id
                    }
        
                    const token = this.jwtService.sign(payload)
                            
                    const userValidated = {
                        user: findUser,
                        token
                    }
                    console.log("userValidated =>", userValidated)
        
                    return userValidated;

                } else {
                    throw new HttpException("La contraseña es incorrecta", 403); 
                }
            } else {
                throw new HttpException("No existe un usuario registrado con este correo", 404); 
            }

        } catch (err){
            throw new Error(err)
        }
    }

    async signUpUser(data: any){
        try{

            //aqui se tiene que guardar toda la data que se le pide al usuario junto con su id de organizacion de la cual entrara a ser parte

            const { password, email} = data;

            const validateUser = await this.prismaService.user.findUnique({
                where: { email }
            })

            if(validateUser){   
                throw new UserInputError('Ya existe una organización registrada con este correo');
            } 

            const encryptPass = await hash(password, 10)
            data['password'] = encryptPass
            return await this.prismaService.user.create({data});

        } catch (error){
            throw new HttpException(
                {
                  status: error.status,
                  message: error.message,
                },
                409
              );
        }
    }

    async mainSignUp(body: MainSignUpDTO): Promise<Organization> {

        try {
          
            const { user, organization: org , test} = body;

            const findUser = await this.prismaService.user.findUnique({
                where: { email: user.email }
            })

            if(findUser){
                throw new HttpException("Este correo ya esta en uso", 400); 
            }

            const encryptPass = await hash(user.password, 10)
            user['password'] = encryptPass

            const user_created = await this.prismaService.user.create({
                data: user
            })

            const org_created = await this.prismaService.organization.create({ data: org })

            if(org_created){

                //creamos la relacion del usuario con la organizacion y su respectivo rol
                //Por defecto se asigna el rol de administrador
                await this.prismaService.members.create({
                    data : {
                        user_id: user_created.id,
                        role_id: 1,
                        org_id: org_created.id
                    }
                })

                //validamos si se respondio el test
                if(test && test.length > 0){

                    for (const res of test){

                        const data = {
                            org_id: org_created.id,
                            question_id: res.question_id,
                            answer_id: res.answer_id
                        }

                        //ingresamos cada una de las respuestas del test
                        await this.prismaService.diagnosis.create({
                            data
                        })
                    }

                }

                return org_created;
      
            } else {
                throw new HttpException("Ocurrió un error al tratar de crear la organización", 400); 
            }

        } catch (error){
            throw new HttpException(
                {
                  status: error.status,
                  message: error.message,
                },
                409
              );
        }
    }

    async diagnosisTest() {
        try {

            //Consultamos el contenido del test de maduración
            const areas = await this.prismaService.area.findMany({
                include: {
                    question: {
                      include: {
                        question_answers: {
                          include: {
                            answer_relation: true
                          }
                        }
                      }
                    }
                }
            })
            
            return areas

        } catch (error) {
            throw new HttpException(
                {
                  status: error.status,
                  message: error.message,
                },
                409
              );
        }
    }

}
