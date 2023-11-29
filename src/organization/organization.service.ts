import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { CreateProjectDTO } from './dto/create-project.dto';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { CreateRolDTO } from './dto/create-rol.dto';
import { AssignAreaDTO } from './dto/assign-area.dto';
import { LoginOrganizationDTO } from './dto/login-organization.dto';
import { compare, hash } from 'bcrypt'
import { UserInputError } from 'apollo-server-express';
import axios from 'axios';
import { Inject } from '@nestjs/common/decorators';
import { Model } from 'mongoose';
import { WebhookDocument } from './schemaMongo/webhook.schema';
import { OrganizationGateway } from './gateway/organization.gateway';
import { RevenueReportDTO } from './dto/revenue-report.dto';
import { RevenuesDocument } from './schemaMongo/revenues.schemas';
import { BudgetReportDTO } from './dto/budget-report.dto';

@Injectable()
export class OrganizationService {
    
    constructor(
        private readonly prismaService: PrismaService,
        private readonly org_gateway: OrganizationGateway,
        @Inject('WEBHOOK_MODEL') private readonly webhook_mongo: Model<WebhookDocument>,
        @Inject('REVENUES_MODEL') private readonly revenues_mongo: Model<RevenuesDocument>
    ) {}

    async getAllResources(projectID: number){
        const resources = await this.prismaService.resources.findMany({
            where: {
                project_id: projectID,
            },
        });

        return resources;
    }

    async getAllAreas(areaType: string){
        const areas = await this.prismaService.area.findMany({
            where: {
                name: areaType,
            },
        });

        return areas;
    }

   async getAllProjects(id_org: number) {
        const projects = await this.prismaService.project.findMany({
            where: {
                id: id_org,
            },
        });
        
        // Establecer campos opcionales como null si no tienen valor definido
        const projectsWithNullValues = projects.map((project) => ({
            ...project,
            obj_general: project.obj_general || null,
            obj_specifics: project.obj_specifics || null,
            budget: project.budget || null,
            software: project.software || null,
            state: project.state || null,
            leader_id: project.leader_id || null,
        }));

        return projectsWithNullValues;
    }

    async getOneProject(idProject: number){
        const project = await this.prismaService.project.findUnique({
            where: {
                id: idProject,
            },
        });

        const projectWithNullValues = {
            ...project,
            obj_general: project?.obj_general || null,
            obj_specifics: project?.obj_specifics || null,
            budget: project?.budget || null,
            software: project?.software || null,
            state: project?.state || null,
            leader_id: project?.leader_id || null,
          };
        
        return projectWithNullValues;
    }

    async getAllRoles() {
        return await this.prismaService.role.findMany({
            select: {
                id: true,
                name: true,
                status: true,
            }
        })
    }

    async getOneOrganization(nit: string) {
        const org = await this.prismaService.organization.findUnique({
            where: { nit }
        });

        if (!org) {
            throw new NotFoundException('La organización no existe')
        }

        return org;
    }

    async getOrganizationCollaborators(id_org: number) {
        const count = await this.prismaService.members.count({ where: { org_id: id_org } })
        console.log("total collaborators =>", count)
        return count;
    }

    async createOrganization(data: CreateOrganizationDTO){
        try{
            console.log("data to create org =>", data)
            const { nit } = data;
            const validateOrg = await this.prismaService.organization.findUnique({
                where: { nit }
            })

            if(validateOrg){   
                throw new UserInputError('Ya existe una Organización registrado con este nit !');
            } 

            // const encryptPass = await hash(password, 10)
            // data['password'] = encryptPass
            const new_org = {
                'nit': data.nit,
                'name': data.name,
                'type': data.type,
                'country': data.country,
                'city': data.city,
                'areas': [1,2],
                created_at: new Date()
            }

            const createOrg = await this.prismaService.organization.create({data: new_org});
            // this.pubSub.publish('projectCreated', { projectCreated : createOrg })


            console.log("createOrg =>", createOrg)
            
            return createOrg;

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

    //createProject VERSION ANTIGUA
    // async createProject(data: CreateProjectDTO){
    //     try {
    //         // Verificar si el nombre del proyecto ya existe
    //         const existingProject = await this.prismaService.project.findUnique({
    //             where: { name : data.name },
    //         });

    //         if (existingProject) {
    //             throw new HttpException('El nombre del proyecto ya está en uso', 409);
    //         }

    //         // Crear el proyecto
    //         const createdProject = await this.prismaService.project.create({
    //             data: {
    //                 name: data.name,
    //                 type: data.type,
    //                 celebration_day: data.celebration_day,
    //                 deadline: data.deadline,
    //                 description: data.description,
    //                 obj_general: data.obj_general,
    //                 obj_specifics: data.obj_specifics,
    //                 budget: data.budget,
    //                 software: data.software,
    //                 state: data.state,
    //                 leader_id: data.leader_id,
    //                 image: data.image,
    //                 org_id: data.org_id
    //             },
    //         });

    //         return createdProject;
    //     } catch (error) {
    //         throw new HttpException(
    //             {
    //                 status: error.status,
    //                 message: error.message,
    //             },
    //             409
    //         );
    //     }
    // }

    async createProject(body: CreateProjectDTO){
        try {

            console.log("body received to create project =>", body)

            //siempre debemos verificar si el token es valido , para si no, entonces hacer el refresh_token, para lo cual necesitamos el refres_token de jira, por ende el refresh_token se debe enviar tambien en el body por si hay que refrescar el access_token

            // await this.jwt_service.verify(body.token)

            // const token_decoded = await this.jwt_service.decode(body.token)
            //extraer el subject/acounntId del token

            // console.log("token_token decoded result =>", token_decoded)

            //construimos el body para crear proyecto en la API de Jira
            const body_creation = {
                key: body.key,
                name: body.name,
                projectTypeKey: "software",
                projectTemplateKey: "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban",
                description: body.description,
                leadAccountId: "640e4f8a407493675d44cdf3",
            }

            const base_url_api_jira = 'https://api.atlassian.com/ex/jira'

            const response = await axios.post(`${base_url_api_jira}/${body.cloud_id}/rest/api/2/project`, body_creation, {
                headers: {
                    Authorization: `Bearer ${body.token}`,
                    Accept: 'application/json'
                },
            });

            console.log("response create project =>", response)

            //dentro de data ya nos responde lo siguiente;
            // data: {
            //     self: 'https://api.atlassian.com/ex/jira/144d926b-8e05-4272-9c99-8172d31136f5/rest/api/2/project/10006',
            //     id: 10006,
            //     key: 'MCI'
            //   }

            //lo cual podemos usar para sincronizar esto en nuestra base de datos de scaleup e ingresar dicha informacion del poryecto que se creo

            const createdProject = await this.prismaService.project.create({
                            data: {
                                name: body.name,
                                type: "tech",
                                // celebration_day: "null",
                                // deadline: "null",
                                description: body.description,
                                // obj_general: "null",
                                obj_specifics: [],
                                budget: 30000,
                                // software: body.software,
                                // state: body.state,
                                leader_id: 1,
                                // image: body.image,
                                org_id: 1
                            },
                        });

            console.log("createdProject result =>", createdProject)
            
            return createdProject;

        } catch (error){
            console.log("error create project =>", error)
            console.log("error.data.errorMessages =>", error.response.data.errorMessages)
            console.log("error.data.errorMessages =>", error.response.data.errors)

            throw new HttpException(
                {
                  status: error.status,
                  message: error.message,
                },
                409
            );
        }
    }

    // async assignTeam(data: TeamProjectDTO){
        //este metodo ahora debria funcionar diferente segun el nuevo schema
    //     try {
    //         const { project_id, org_id, user_id,status, areas } = data;

    //         const user = await this.prismaService.user.findUnique({ where: { id: user_id }});
    //         const project = await this.prismaService.project.findUnique({ where: { id: project_id }});

    //         if (!user) {
    //             throw new Error(`User with ID ${user_id} does not exist.`);
    //         }

    //         if (!project) {
    //             throw new Error(`Project with ID ${project_id} does not exist.`);
    //         }

    //         const AssignedTeam = await this.prismaService.team.create({
    //             data: {
    //                 project_id,
    //                 org_id,
    //                 status,
    //                 areas
    //             },
    //         });

    //         return AssignedTeam;
    //     } catch (error) {
    //         throw new HttpException(
    //             {
    //                 status: error.status,
    //                 message: error.message,
    //             },
    //             409
    //         );
    //     }
    // }

    async saveResource(data: CreateResourceDTO): Promise<any> {
        try {
            const { name, file, project_id, activity_id } = data;
        
            const project = await this.prismaService.project.findUnique({ where: { id: project_id }});
            if (!project) {
                throw new Error(`Project with ID ${project_id} does not exist.`);
            }
        
            const recurso = await this.prismaService.resources.create({
                data: {
                    name,
                    file,
                    project_id,
                    activity_id,
                },
            });
        
            return recurso;
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

    async assignArea(data: AssignAreaDTO): Promise<any> {
        try {
            const { name } = data;

            const newArea = await this.prismaService.area.create({
                data: {
                    name
                }
            })

            return newArea;
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

    async createRol(data: CreateRolDTO){
        const { name } = data;

        // const rolExisting = await this.prismaService.role.findUnique({ where: { name }});

        const newRol = await this.prismaService.role.create({
            data: {
                name
            }
        })
        
        // if(rolExisting){
        //     throw new UserInputError('Éste rol ya existe');
        // }else{
        // }
        return newRol;
    }

    async deleteProject(id: number){
        return await this.prismaService.project.delete({ where: { id } });
    };
      
    async loginOrganization(data: LoginOrganizationDTO){
        const { email, password } = data;

        const user = await this.prismaService.user.findUnique({ where: { email }})

        if(!user){
            throw new UserInputError('No existe una organización ligada al NIT consultado');
        }

        const verifyPass = await compare(password, user.password)

        if(!verifyPass){
            throw new UserInputError('Contraseña incorrecta');
        }

        return user;
    }

    receiveNotification(body: any){

        this.org_gateway.server.emit('OrganizationMessage', body)
    
        return {
          status: 200,
          message: 'body notification!'
        }
    }

    async notificationsJiraWebhook(body){
        try{
            console.log("usando endpoint que recibe notification webhook")
            console.log("body received => ", body)

            // Crea una notificación
            const newNotification = {
                webhook_event: body.webhookEvent,
                account_id: body.user.accountId,
                user_name: body.user.displayName,
                issue_id: body.issue.id,
                issue_key: body.issue.key,
                issue_summary: body.issue.fields.summary,
                issue_type: body.issue.fields.issuetype.name,
                changeover_date: body.issue.fields.updated,
                status: body.issue.fields.status.name,
                created_at: new Date(),
            };

            // Guarda la nueva notificación en la base de datos Mongo
            const notification = new this.webhook_mongo(newNotification);
            await notification.save();

            //notificamos al frontend
            this.org_gateway.server.emit('projectWebhook', body)

            return {
                status: 200,
                body : "Notification saved successfully"
            }

        }catch (error) {
            console.error("Error saving notification:", error);
            throw new HttpException(
              {
                status: error.status,
                message: error.message,
              },
              409
            );
          }

    }

    async  getProjectRevenues(query){
        try {

            const { org_id, project_id } = query;

            const project_report = await this.revenues_mongo.findOne({
                'org_id': org_id, 'project_id': project_id
            })

            const project = await this.prismaService.project.findUnique({ where: { id: project_id }})
            
            const cumulativeAmounts = this.calculateCumulative(project_report);          
            project_report.revenue_reports = cumulativeAmounts;
            project_report['budget'] = project.budget
            
            return project_report
        }catch (error) {
            throw new HttpException(
              {
                status: error.status,
                message: error.message,
              },
              409
            );
          }
    }

    async addRevenuesReport(data: RevenueReportDTO){
        try {

            //el reporte se debe recibir para ingresarlo en una colección de Mongo DB de la organización en un proyecto especifico
            const { org_id, project_id, date, amount } = data;

            //primero verificamos si ya existe el documento
            const project_report = await this.revenues_mongo.findOne({
                'org_id': org_id, 'project_id': project_id
            })

            //si ya existe ingresamos un nuevo reporte 
            if(project_report){

                const reports = [
                    ...project_report.revenue_reports,
                    {
                        date,
                        amount
                    }
                ];

                await this.revenues_mongo.updateOne({
                    'org_id': org_id, 'project_id': project_id
                }, { $set: {
                    'revenue_reports': reports
                }})

            } else {
            //sino existe creamos el documento
                const create_report = new this.revenues_mongo({
                    org_id,
                    project_id,
                    revenue_reports: [
                        {
                            date,
                            amount
                        }
                    ],
                    created_at: new Date()
                });
                await create_report.save();

            }

            //una vez se guarde en Mongo , debo consultar el documento actual para retornarlo por medio de un mensaje de websocket
            const report_updated = await this.revenues_mongo.findOne({
                'org_id': org_id, 'project_id': project_id
            })

            const project = await this.prismaService.project.findUnique({ where: { id: project_id }})
            
            const cumulativeAmounts = this.calculateCumulative(report_updated);          
            report_updated.revenue_reports = cumulativeAmounts;
            report_updated['budget'] = project.budget

            this.org_gateway.server.emit('IndexROI', report_updated)

            return {
                status: 200,
                message: "Informe registrado exitosamente!"
            }

        }catch (error) {
            console.error("Error saving notification:", error);
            throw new HttpException(
              {
                status: error.status,
                message: error.message,
              },
              409
            );
          }
    }

    async addNewBudget(data: BudgetReportDTO ){
        try {

            const { org_id, project_id, date, amount } = data;

            const project = await this.prismaService.project.findUnique({ where: { id: project_id }})

            //actualizamos el presupuesto del proyecto
            await this.prismaService.project.update({
                data: {
                    budget: project.budget + amount
                },
                where: {
                    id: project_id
                }
            })

            const report_mongo = await this.revenues_mongo.findOne({
                'org_id': org_id, 'project_id': project_id
            })

            if(report_mongo?.budget_reports && report_mongo?.budget_reports.length > 1){

                const reports = [
                    ...report_mongo.budget_reports,
                    {
                        date,
                        amount
                    }
                ];

                await this.revenues_mongo.updateOne({
                    'org_id': org_id, 'project_id': project_id
                }, { $set: {
                    'budget_reports': reports
                }})

            } else {

                await this.revenues_mongo.updateOne({
                    'org_id': org_id, 'project_id': project_id
                }, { $set: {
                    'budget_reports': [
                        {
                            date: project.created_at,
                            amount: project.budget
                        },
                        {
                            date,
                            amount
                        }
                    ],
                }})

            }

            const report_updated = await this.revenues_mongo.findOne({
                'org_id': org_id, 'project_id': project_id
            })

            const cumulativeAmounts = this.calculateCumulative(report_updated);          
            report_updated.revenue_reports = cumulativeAmounts;
            
            this.org_gateway.server.emit('IndexROI', report_updated)

            return {
                status: 200,
                message: "Reporte de presupuesto registrado exitosamente!"
            }
            
        }catch (error) {
            throw new HttpException(
              {
                status: error.status,
                message: error.message,
              },
              409
            );
        }
    }

    calculateCumulative(data) {
        let accumulatedAmount = 0;
        console.log("data received int calculate =>", data)
        return data.revenue_reports.map(report => ({
            date: report.date,
            amount: accumulatedAmount += report.amount
        }));
    }


    //este metodo es para ingresar informacion de las areas, y sus preguntas y opciones de respuesta
    async seedDataQuestionsAndAnswers(body: any){
        try {

            console.log("ingresando data semilla")

            const {
                // areas,
                // questions,
                // answers,
                questions_answers
             } = body;


            //para ingresar la info semilla primero ingresamos solo la info de las areas para que obtengan ID's, y despues si ingresamos la data de las questions y answers

            // aqui se debe ingresar cada una de las areas
            // for (const area of areas){

            //     await this.prismaService.area.create({
            //         data: area
            //     })
            // }

            //despues cada una de las preguntas con el id de las areas y si is_main
            // for (const question of questions){

            //     await this.prismaService.questions.create({
            //         data: question
            //     })
            // }

            //depues cada una de las respuestas con values y types
            // for (const answer of answers){

            //     await this.prismaService.answers.create({
            //         data: answer
            //     })
            // }

            for (const item of questions_answers){

                await this.prismaService.question_answers.create({
                    data: {
                        question: item.question,
                        answer: item.answer
                    }
                })
            }

            return {
                status: 200,
                message: "seedData ingresada exitosamente"
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



}