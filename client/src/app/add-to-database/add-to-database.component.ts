import { HttpClient } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"

@Component({
	selector: "app-add-to-database",
	templateUrl: "./add-to-database.component.html",
	styleUrls: ["./add-to-database.component.scss"]
})
export class AddToDatabaseComponent implements OnInit {
	private host =
		window.location.hostname === "localhost" ? "http://localhost:5000" : ""
	public message = "Click anywhere to choose file"

	constructor(public http: HttpClient) {}

	ngOnInit(): void {
		document.getElementById("input")?.click()
	}

	fileChangeEvent(e: any) {
		if (!e.target.files || e.target.files.length === 0) return

		const file = e.target.files[0]

		if (file && file.name.endsWith(".pgn")) {
			const reader = new FileReader()
			reader.readAsText(file, "UTF-8")

			reader.onload = e => {
				const data = e.target?.result

				if (data) {
					this.http
						.post<any>(this.host + "/api/database", { file: data })
						.subscribe(console.warn)
				}
			}
		} else {
			this.message = "File must be a PGN chess file"
		}
	}
}
