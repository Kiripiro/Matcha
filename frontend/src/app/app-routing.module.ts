import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { ChatComponent } from './chat/chat.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profil/:username', component: ProfilComponent },
  { path: 'auth', loadChildren: () => AuthModule },
  { path: 'chat', component: ChatComponent },
  { path: 'notFound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notFound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
