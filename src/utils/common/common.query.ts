import * as queryTypes from "./common.query.interface";
import { getRepository, DeleteResult } from "typeorm";
import * as Er from "../errors/error.variants";

export const getFromRepoQuery: queryTypes.getQueryFunc = <T>(
  type: {
    new (...args: any[]): T;
  },
  include?: string[],
): Promise<T[]> =>
  getRepository(type)
    .find({ relations: include ?? [] })
    .catch((err: Error) => {
      throw Er.DbError(err.message, err.stack);
    });

export const getOneFromRepoQuery: queryTypes.getOneQueryFunc = <T>(
  type: { new (...args: any[]): T },
  id: number | string,
  include?: string[],
): Promise<T> =>
  getRepository(type)
    .findOne(id, { relations: include ?? [] })
    .catch((err: Error) => {
      throw Er.DbError(err.message, err.stack);
    })
    .then((entity) => {
      if (entity === undefined) {
        throw Er.NotFoundError(id.toString());
      }
      return entity;
    });

export const createFromRepoQuery: queryTypes.createQueryFunc = async <R, T>(
  type: {
    new (...args: any[]): T;
  },
  value: R,
  include?: string[],
): Promise<T> => {
  const entity = await getRepository(type)
    .save(getRepository(type).create(value))
    .catch((err: Error) => {
      throw Er.DbError(err.message, err.stack);
    });
    
  return getOneFromRepoQuery(type, (entity as any).id, include);
};

export const updateFromRepoQuery: queryTypes.updateQueryFunc = <R, T>(
  type: {
    new (...args: any[]): T;
  },
  valueCurrent: T,
  valueUpdated: R,
): Promise<T> =>
  getRepository(type)
    .save(getRepository(type).merge(valueCurrent, valueUpdated))
    .catch((err: Error) => {
      throw Er.DbError(err.message, err.stack);
    });

export const deleteFromRepoQuery: queryTypes.deleteQueryFunc = <T>(
  type: { new (...args: any[]): T },
  id: number,
): Promise<DeleteResult> =>
  getRepository(type)
    .delete(id)
    .catch((err: Error) => {
      throw Er.DbError(err.message, err.stack);
    });
