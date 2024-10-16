import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuthGuard';
export const SkipAuthGuard = () => SetMetadata(SKIP_AUTH_KEY, true);
