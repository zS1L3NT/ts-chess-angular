import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { GameComponent } from "./game/game.component"
import { PlayerSelectComponent } from "./player-select/player-select.component"

const routes: Routes = [
	{ path: "white", component: GameComponent },
	{ path: "black", component: GameComponent },
	{ path: "", component: PlayerSelectComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
