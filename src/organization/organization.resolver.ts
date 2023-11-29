import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { LoginOrganizationDTO } from './dto/login-organization.dto';
import { Organization } from './model/organization';
import { Project } from './model/project';
import { AreaModel } from './model/area';
import { Role } from './model/role';
import { Resources } from './model/resources';
import { OrganizationService } from './organization.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Members } from './model/members';
import { AssignAreaDTO } from './dto/assign-area.dto';
import { CreateRolDTO } from './dto/create-rol.dto';
import { PubSub } from 'graphql-subscriptions';
import { Response } from './model/response';
import { RevenueDataDTO, RevenueReportDTO } from './dto/revenue-report.dto';
import { RevenueReport } from './model/revenue-report';
import { BudgetReportDTO } from './dto/budget-report.dto';

@Resolver()
export class OrganizationResolver {

    private pubSub = new PubSub();
    constructor(private readonly organizationService: OrganizationService) { }

    @Query(() => [Role])
    async getAllRoles(): Promise<Role[]> {
        return await this.organizationService.getAllRoles();
    }

    @Query(() => [AreaModel])
    async getAllAreas(@Args('type') areaType: string): Promise<AreaModel[]> {
        return await this.organizationService.getAllAreas(areaType);
    }

    @Query(() => [Resources])
    async getAllResources(@Args('project_id') ProjectID: number): Promise<Resources[]> {
        return await this.organizationService.getAllResources(ProjectID);
    }

    @Query(() => [Project])
    async getAllProjects(@Args('org_id', { type: () => Int }) org_id: number): Promise<Project[]> {
        return await this.organizationService.getAllProjects(org_id);
    }

    @Query(() => Project)
    async getOneProject(@Args('id') idProject: number): Promise<Project> {
        return await this.organizationService.getOneProject(idProject);
    }

    @Query(() => Organization)
    async getOneOrganization(@Args('nit') nit: string): Promise<Organization> {
        return await this.organizationService.getOneOrganization(nit);
    }

    @Query(() => Organization)
    async getOrganizationCollaborators(@Args('nit') id_org: number) {
        return await this.organizationService.getOrganizationCollaborators(id_org);
    }

    @Mutation(() => Organization)
    async createOrganization(@Args('input') input: CreateOrganizationDTO) {
        const org = await this.organizationService.createOrganization(input)
        this.pubSub.publish('projectCreated', { projectCreated : org })
        return org;
    }

    @Mutation(() => Organization)
    async loginOrganization(@Args('input') input: LoginOrganizationDTO) {
        return await this.organizationService.loginOrganization(input)
    }

    @Mutation(() => Project)
    async createProject(@Args('input') input: CreateProjectDTO) {
        return await this.organizationService.createProject(input)
    }

    // @Mutation(() => Members)
    // async AssignTeam(@Args('input') input: TeamProjectDTO) {
    //     return await this.organizationService.AssignTeam(input)
    // }

    // @Mutation(() => Resources)
    // async saveResource(@Args('input') input: CreateResourceDTO) {
    //     return await this.organizationService.saveResource(input)
    // }

    @Mutation(() => AreaModel)
    async assignArea(@Args('input') input: AssignAreaDTO) {
        return await this.organizationService.assignArea(input)
    }

    @Mutation(() => Role)
    async createRole(@Args('input') input: CreateRolDTO) {
        return await this.organizationService.createRol(input)
    }

    @Mutation(() => Project)
    async deleteProject(@Args('id') id: number) {
        return await this.organizationService.deleteProject(id)
    }

    @Mutation(() => Response)
    async addRevenuesReport(@Args('input') input: RevenueReportDTO) {
        return await this.organizationService.addRevenuesReport(input)
    }

    @Mutation(() => Response)
    async addNewBudget(@Args('input') input: BudgetReportDTO) {
        return await this.organizationService.addNewBudget(input)
    }

    @Query(() => RevenueReport)
    async getProjectRevenues(@Args('input') input: RevenueDataDTO ) {
        return await this.organizationService.getProjectRevenues(input);
    }

    @Subscription(() => Organization, {
        filter: (payload, variables) => payload.projectCreated.name === variables.name,
    })
    async projectCreated(@Args('name') name: string){
        return this.pubSub.asyncIterator('projectCreated');
    }
}
