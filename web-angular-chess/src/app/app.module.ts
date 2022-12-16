import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { HttpClientModule } from "@angular/common/http"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BoardComponent } from "./game/board/board.component"
import { PieceComponent } from "./game/piece/piece.component"
import { SelectBorderComponent } from "./game/select-border/select-border.component"
import { TileComponent } from "./game/tile/tile.component"
import { AttackedBorderComponent } from "./game/attacked-border/attacked-border.component"
import { GameComponent } from "./game/game.component"
import { WinBannerComponent } from "./win-banner/win-banner.component"
import { PlayerSelectComponent } from "./player-select/player-select.component";
import { HasmoveBorderComponent } from './game/hasmove-border/hasmove-border.component';
import { AddToDatabaseComponent } from './add-to-database/add-to-database.component'

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		PieceComponent,
		SelectBorderComponent,
		TileComponent,
		AttackedBorderComponent,
		GameComponent,
		WinBannerComponent,
		PlayerSelectComponent,
		HasmoveBorderComponent,
		AddToDatabaseComponent
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
