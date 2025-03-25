import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ListComponent } from './pages/list/list.component';

export const routes: Routes = [
    {
        path: "",
        component: CadastroComponent
    },
    {
        path: "list",
        component: ListComponent
    }
];
