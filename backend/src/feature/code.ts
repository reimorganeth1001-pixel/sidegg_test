import prisma from '@/service/db';
import { codeType } from '@/types';

/**
 * Validate a verification code and mark it as consumed.
 *
 * Rules:
 * - Code must exist in `codeStatus`.
 * - Code must still have `status === true` (unused).
 * - On success, `status` is set to `false` and the code is returned.
 */
export const searchCodeAndUpdateStatus = async (code: string): Promise<codeType.searchCodeAndUpdateStatusResponse> => {
  try {
    const checkIfCodeValidate = await prisma.codeStatus.findFirst({
        where: {
            code: code
        },
        select: {
            id: true,
            code: true,
            status: true
        }
    });


    if(!checkIfCodeValidate){
      throw new Error("verification code is not valid!");
    }

    if(checkIfCodeValidate?.status === false) {
        throw new Error("Code has been used!");
    }

    const response = await prisma.codeStatus.update({
        where: {
            code: code
        },
        data: {
            status: false
        }
    });

    return {
      data: {
        code: response.code,
      },
      error:"",
      success: true
    }
  } catch (error) {
    let err_str = "";
    if(error instanceof Error) {
      err_str = error.message;
    } else {
      err_str = "Unknown Error";
    }
    return {
      error: err_str,
      success: false
    }
  }
};