import prisma from '@/service/db';
import {
  defaultType,
  teamType,
} from '@/types';

export const updateTeams = async(teams:teamType.Team[]): Promise<defaultType.dbGetResponse> => {
    try {
        for (const team of teams) {
            const existTeam = await prisma.team.findUnique({
                where: {
                    id: team.id
                }
            });
            if(existTeam) continue;

            await prisma.team.create({
                data: {
                    id: team.id,
                    name: team.name,
                    abbbreviation: team.abbbreviation,
                    location: team.location,
                    displayName: team.location,
                    shortDisplayName: team.shortDisplayName,
                    slug: team.slug,
                    logo: team.logo
                }
            })
        };
        return {
            success: true
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Insert team record error"
        }
    }
}
