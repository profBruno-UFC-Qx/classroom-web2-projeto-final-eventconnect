import { Inscription } from "../inscription/inscription.entity";
export declare class User {
    id: number;
    username: string;
    email: string;
    password?: string;
    provider: string;
    resetPasswordToken: string;
    confirmationToken: string;
    confirmed: boolean;
    blocked: boolean;
    created_at: Date;
    updated_at: Date;
    inscricaos: Inscription[];
}
//# sourceMappingURL=user.entity.d.ts.map