import { combinationAdditions } from "@/lib/combination-additions";
import { combinations as coreCombinations, type ResearchCombination } from "@/lib/combinations";

export const combinations: ResearchCombination[] = [...coreCombinations, ...combinationAdditions];
