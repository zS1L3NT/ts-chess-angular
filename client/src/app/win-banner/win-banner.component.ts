import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"
import { BoardService } from "../board.service"

@Component({
	selector: "app-win-banner",
	templateUrl: "./win-banner.component.html",
	styleUrls: ["./win-banner.component.scss"]
})
export class WinBannerComponent {
	@Input() team!: "white" | "black"

	constructor(
		protected router: Router,
		protected BoardService: BoardService
	) {}

	toMenu() {
		this.router.navigate(["/"])
	}

	message(): string {
		const winner = this.BoardService.getWinner()

		if (winner) {
			if (winner === "draw") return "It's a Draw!"
			if (winner === this.team) return "You win!"
			return "You lost!"
		}

		return ""
	}
}
