import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AddToDatabaseComponent } from "./add-to-database/add-to-database.component"
import { GameComponent } from "./game/game.component"
import { PlayerSelectComponent } from "./player-select/player-select.component"

const routes: Routes = [
	{ path: "database", component: AddToDatabaseComponent },
	{ path: "white", component: GameComponent },
	{ path: "black", component: GameComponent },
	{ path: "", component: PlayerSelectComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
