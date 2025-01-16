import { SuccessResponseDTO } from './responseDTO';

export enum ProductTypes {
  AUTO = 'auto',
  HEALTH = 'health',
}

export enum PendingPolicyStatus {
  USED = 'used',
  UNUSED = 'unused',
}

export enum REPOSITORIES {
  PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY',
  CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY',
  POLICY_REPOSITORY = 'POLICY_REPOSITORY',
  PLAN_REPOSITORY = 'PLAN_REPOSITORY',
  PENDING_POLICY_REPOSITORY = 'PENDING_POLICY_REPOSITORY',
  USER_REPOSITORY = 'USER_REPOSITORY',
  WALLET_REPOSITORY = 'WALLET_REPOSITORY',
}

export function slugify(slug: string): string {
  return slug
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const sendSuccessResponse = (
  data: any = null,
  message: string = 'Action successful',
  statusCode = 200,
): SuccessResponseDTO => {
  return {
    success: true,
    message,
    data: data,
    statusCode: statusCode,
  };
};


module.exports = {
  PendingPolicyStatus,
  slugify,
  ProductTypes,
  sendSuccessResponse,
  REPOSITORIES,
};
