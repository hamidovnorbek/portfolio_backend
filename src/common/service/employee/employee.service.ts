import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { EmployeeError } from 'src/common/db/models/employee/employee.error';
import { Employee, EmployeeModel, EmployeeType } from 'src/common/db/models/employee/employee.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { EmployeeGetDto } from 'src/modules/admin/employee/employee.dto';
import { CommonService } from '../common.service';

@Injectable({})
export class EmployeeService extends CommonService<Employee> {
    constructor() {
        super(EmployeeModel, ErrorCodes.EMPLOYEE, ErrorCodes.EMPLOYEE + 1);
    }

    private $commonProject: PipelineStage.Project = {
        $project: {
            password: 0,
        },
    };

    async getByPhoneNumber(phone_number: string, type: EmployeeType = EmployeeType.ADMIN) {
        const query: typeof this.Filter = {
            phone_number,
            type,
        };

        const item = await this.findOne(query);
        if (!item) throw EmployeeError.NotFound(phone_number);

        return item;
    }

    async getById(id: Types.ObjectId) {
        const $match: PipelineStage.Match = {
            $match: {
                _id: id,
            },
        };

        const pipeline = [$match, this.$commonProject];

        const data = await this.aggregate(pipeline);
        if (!data.length) throw EmployeeError.NotFound(id);

        return data.shift();
    }

    async getPaging(dto: EmployeeGetDto) {
        const { search, accessed_organization_ids, organization_id, sort_by, asc, type } = dto;
        const query: typeof this.Filter = {
            is_boss: false,
        };
        if (type) query.type = type;
        if (accessed_organization_ids?.length) query.organization_ids = { $in: accessed_organization_ids };
        else if (organization_id) query.organization_ids = organization_id;
        if (search) {
            query.$and.push({
                $or: [{ full_name: search }, { phone_number: search }, { number: search }],
            });
        }
        let sort: any = {
            _id: -1,
        };
        if (sort_by && asc) sort = { [sort_by]: Number(asc) };

        const pipeline: PipelineStage[] = [this.$commonProject];
        return await this.findPaging(query, dto, pipeline, sort);
    }

    async getChoose(dto: EmployeeGetDto) {
        const { search, organization_id } = dto;
        const query: typeof this.Filter = {};

        if (organization_id) query.organization_ids = organization_id;
        if (search) {
            query.$or = [{ full_name: search }, { phone_number: search }];
        }

        const $project: PipelineStage.Project = {
            $project: {
                full_name: 1,
                phone_number: 1,
                balance: 1,
                balance_currency_id: 1,
            },
        };
        return await this.findPaging(query, dto, [$project]);
    }
}

export const employeeService = new EmployeeService();
