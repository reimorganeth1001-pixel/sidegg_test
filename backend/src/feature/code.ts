import prisma from '@/service/db';
import { codeType } from '@/types';

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