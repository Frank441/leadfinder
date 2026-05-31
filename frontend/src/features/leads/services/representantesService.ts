import type { Representante } from '@leadfinder/shared/types/leads';
import { apiFetch } from '../../../lib/api';

export const representantesService = {
    getAll: () => apiFetch<Representante[]>('/api/v1/leads/representantes'),
};
