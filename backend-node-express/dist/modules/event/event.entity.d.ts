import { Category } from "../category/category.entity.js";
import { Inscription } from "../inscription/inscription.entity.js";
export declare class Event {
    id: number;
    nome: string;
    descricao: string;
    imagem: string;
    data: Date;
    endereco: string;
    categoria: Category;
    inscricaos: Inscription[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=event.entity.d.ts.map