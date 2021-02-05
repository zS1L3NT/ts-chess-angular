import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { BoardService } from "../board.service"

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.scss"]
})
export class GameComponent {
	team!: "white" | "black"

	constructor(private router: Router, public BoardService: BoardService) {
		const URL = this.router.url.slice(1)
		if (URL === "white") this.team = "white"
		else if (URL === "black") this.team = "black"
		else this.router.navigate(["/"])
	}
}
