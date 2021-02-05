import { Component } from "@angular/core"
import { Router } from "@angular/router"

@Component({
	selector: "app-player-select",
	templateUrl: "./player-select.component.html",
	styleUrls: ["./player-select.component.scss"]
})
export class PlayerSelectComponent {
	constructor(protected router: Router) {}

	toWhite() {
		this.router.navigate(["/white"])
	}

	toBlack() {
		this.router.navigate(["/black"])
	}
}
