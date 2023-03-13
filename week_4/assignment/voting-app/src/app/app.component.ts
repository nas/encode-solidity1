import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const QUERY_API_URL=`${process.env['BASE_VOTING_API_URL']}/query-results`

type VotingResult = {
  proposals?: {name: string, votes: string}[],
  winner?: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  votingResult: VotingResult = {}

  constructor(private http: HttpClient) {
    this.queryResults()
  }

  queryResults(){
    return this.http.get<{result: string}>(QUERY_API_URL).subscribe((result) => {
      this.votingResult = result as VotingResult
    })
  }
}
