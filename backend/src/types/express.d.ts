import type { AuthTokenPayload } from "@leadfinder/shared/types/auth";

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}

export {}
