import { experienceService } from 'src/common/service/portfolio/experience/experience.service';
import { heroService } from 'src/common/service/portfolio/hero/hero.service';
import { metricService } from 'src/common/service/portfolio/metric/metric.service';
import { proofService } from 'src/common/service/portfolio/proof/proof.service';
import { projectService } from 'src/common/service/portfolio/project/project.service';
import { siteSettingsService } from 'src/common/service/portfolio/site-settings/site-settings.service';
import { skillCategoryService } from 'src/common/service/portfolio/skill-category/skill-category.service';
import { skillService } from 'src/common/service/portfolio/skill/skill.service';

class PortfolioAssistant {
    async getAggregatedPayload() {
        const [hero, metrics, experiences, categories, skills, proofs, projects, settings] = await Promise.all([
            heroService.getOne(),
            metricService.getAll(),
            experienceService.getAll(),
            skillCategoryService.getAll(),
            skillService.getAll(),
            proofService.getAll(),
            projectService.getAll(),
            siteSettingsService.getOne(),
        ]);

        const skills_grouped = (categories || []).map((category: any) => ({
            ...category,
            skills: (skills || []).filter((skill: any) => skill.category_id?.toString() === category._id?.toString()),
        }));

        return {
            hero,
            metrics,
            experiences,
            skills: skills_grouped,
            proofs,
            projects,
            settings,
        };
    }
}

export const portfolioAssistant = new PortfolioAssistant();
