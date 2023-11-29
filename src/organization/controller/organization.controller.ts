import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Subscription } from '@nestjs/graphql';
import { OrganizationService } from '../organization.service';
import { CreateOrganizationDTO } from '../dto/create-organization.dto';
import { LoginOrganizationDTO } from '../dto/login-organization.dto';
import { CreateProjectDTO } from '../dto/create-project.dto';
import { CreateResourceDTO } from '../dto/create-resource.dto';
import { AssignAreaDTO } from '../dto/assign-area.dto';
// import { TeamProjectDTO } from '../dto/TeamProjectDTO.dto';
import { CreateRolDTO } from '../dto/create-rol.dto';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common/decorators';
import { Organization } from '../model/organization';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
    ) {}

  @Get('/projects/org/:id_org')
  async getAllProjects(@Param('id_org') id_org: number){
    return this.organizationService.getAllProjects(id_org);
  }

  @Get('/project/id/:id')
  async getOneProject(@Param('id') id: number){
    return this.organizationService.getOneProject(id);
  }

  @Get('/project/id/:project_id/resources')
  async getAllResources(@Param('project_id') project_id: number){
    return this.organizationService.getAllResources(project_id);
  }

  @Get(':type/areas')
  async getAllArea(@Param('type' ) type: string){
    return this.organizationService.getAllAreas(type);
  }

  @Get(':type/roles')
  async getAllRoles(){
    return this.organizationService.getAllRoles();
  }

  @Get(':nit')
  async findOne(@Param('nit') nit: string) {
    return this.organizationService.getOneOrganization(nit);
  }

  // @Post()
  // async create(@Body() data: CreateOrganizationDTO) {
  //   return this.organizationService.createOrganization(data);
  // }

  @Post('login')
  async login(@Body() data: LoginOrganizationDTO) {
    return this.organizationService.loginOrganization(data);
  }

  @Post('Project')
  async createProject(@Body() data: CreateProjectDTO) {
    return this.organizationService.createProject(data);
  }

  // @Post('team')
  // async AssignTeam(@Body() data: TeamProjectDTO) {
  //   return this.organizationService.assignTeam(data);
  // }

  @Post('Resources')
  async saveResource(@Body() data: CreateResourceDTO) {
    return this.organizationService.saveResource(data);
  }

  @Post('Area')
  async assignArea(@Body() data: AssignAreaDTO) {
    return this.organizationService.assignArea(data);
  }

  @Post('Role')
  async createRol(@Body() data: CreateRolDTO) {
    return this.organizationService.createRol(data);
  }

  @Delete('project/:id')
  async deleteProject(@Param('id') id: number) {
    return this.organizationService.deleteProject(id);
  }

  @Post('notifications')
  async notificationsJira(@Body() body: any) {
      return this.organizationService.notificationsJiraWebhook(body);
  }

  @Post('send-org-notify')
  receiveNotify(@Body() body: any){
    return this.organizationService.receiveNotification(body)
  }

  //seedData test
  @Post('seed')
  async seedData(@Body() body: any) {
      return this.organizationService.seedDataQuestionsAndAnswers(body);
  }

  @Subscription(() => Organization)
    async projectCreated(){
        return this.pubSub.asyncIterator('projectCreated');
    }
}
