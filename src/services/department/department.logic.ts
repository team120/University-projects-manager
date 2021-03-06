import { plainToClass } from "class-transformer";
import { Department } from "../../entities/department/department.model";
import { DepartmentShowDto } from "../../entities/department/output/department.show.dto";
import * as queryTypes from "../../utils/common/common.query.interface";

export const getDepartmentsLogic = (
  getQuery: queryTypes.getQueryFunc,
) => (): Promise<DepartmentShowDto[]> =>
  getQuery(Department, ["university"]).then((departments) =>
    departments.map((department) =>
      plainToClass(DepartmentShowDto, department),
    ),
  );

export const getOneDepartmentLogic = (
  getOneQuery: queryTypes.getOneQueryFunc,
) => (id: number): Promise<DepartmentShowDto> =>
  getOneQuery(Department, id, ["university"]).then((department) =>
    plainToClass(DepartmentShowDto, department),
  );

export const createDepartmentLogic = (
  getCreateQuery: queryTypes.createQueryFunc,
) => (department: Department) =>
  getCreateQuery(Department, department, ["university"]).then((department) =>
    plainToClass(DepartmentShowDto, department),
  );
